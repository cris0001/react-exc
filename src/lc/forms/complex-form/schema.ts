import {z} from "zod"

// ============================================================================
// SCHEMA — WERSJA POD ZOD 4
//
// Różnice względem Zoda 3 (zaznaczone przy każdym miejscu):
//   - invalid_type_error / required_error USUNIĘTE -> jeden parametr `error`
//   - `message` jest deprecated (nadal działa) -> preferowany `error`
//   - z.ZodIssueCode.custom -> literał "custom"
//   - .superRefine() deprecated na rzecz .check() (superRefine nadal działa)
//   - ctx.path niedostępne w refinementach
// ============================================================================

export const lineItemSchema = z.object({
    description: z.string().min(1, {error: "Opis jest wymagany"}),

    // coerce — inputy HTML zwracają STRING nawet przy type="number".
    // Bez coerce dostałbyś "Expected number, received string".
    //
    // ZOD 4: było { invalid_type_error: "..." }, teraz { error: "..." }
    quantity: z.coerce
        .number({error: "Ilość musi być liczbą"})
        .int({error: "Ilość musi być liczbą całkowitą"})
        .min(1, {error: "Ilość musi być co najmniej 1"}),

    unitPrice: z.coerce
        .number({error: "Cena musi być liczbą"})
        .positive({error: "Cena musi być większa od zera"}),
})

export const orderSchema = z
    .object({
        email: z
            .string()
            .min(1, {error: "Email jest wymagany"})
            // .email() na ZodString jest w Zodzie 4 deprecated (działa, ale ostrzega).
            // Nowa forma to top-level z.email(). Zostawiam metodę, bo tak wygląda
            // większość istniejącego kodu, który zobaczysz.
            .email({error: "Nieprawidłowy format email"}),

        items: z
            .array(lineItemSchema)
            .min(1, {error: "Zamówienie musi mieć co najmniej jedną pozycję"}),

        paymentMethod: z.enum(["card", "transfer"]),

        // opcjonalne na poziomie pola — wymagalność zależy od paymentMethod,
        // czyli od INNEGO pola. Taką regułę da się wyrazić dopiero w superRefine.
        cardNumber: z.string().optional(),

        discountCode: z.string().optional(),
    })
    // superRefine — walidacja MIĘDZY polami. Dostaje cały obiekt, więc widzi
    // wszystkie wartości naraz. W Zodzie 4 jest deprecated na rzecz .check()
    // (wariant .check() pokazany na dole pliku), ale nadal działa.
    .superRefine((data, ctx) => {
        // REGUŁA 1: numer karty wymagany tylko przy płatności kartą
        if (data.paymentMethod === "card") {
            const digits = (data.cardNumber ?? "").replace(/\s/g, "")

            if (!digits) {
                ctx.addIssue({
                    // ZOD 4: było z.ZodIssueCode.custom, teraz literał
                    code: "custom",
                    message: "Numer karty jest wymagany przy płatności kartą",
                    path: ["cardNumber"],   // ← przypisuje błąd do TEGO pola formularza
                })
            } else if (!/^\d{16}$/.test(digits)) {
                ctx.addIssue({
                    code: "custom",
                    message: "Numer karty musi mieć 16 cyfr",
                    path: ["cardNumber"],
                })
            }
        }

        // REGUŁA 2: kod rabatowy zależy od SUMY, która wynika z pozycji
        if (data.discountCode) {
            const code = data.discountCode.trim().toUpperCase()

            if (code !== "SAVE10") {
                ctx.addIssue({
                    code: "custom",
                    message: "Nieprawidłowy kod rabatowy",
                    path: ["discountCode"],
                })
            } else {
                const total = calculateTotal(data.items)

                if (total < 100) {
                    ctx.addIssue({
                        code: "custom",
                        message: "Kod SAVE10 wymaga zamówienia za min. 100 zł",
                        path: ["discountCode"],
                    })
                }
            }
        }
    })

// Typ formularza WYNIKA ze schemy — jedno źródło prawdy.
export type OrderFormValues = z.input<typeof orderSchema>
export type OrderFormOutput = z.output<typeof orderSchema>

// z.input  = typ PRZED transformacją (quantity jako string z inputa)
// z.output = typ PO transformacji (quantity już jako number)
// RHF pracuje na input, onSubmit dostaje output.

// ---------------------------------------------------------------------------
// SELEKTORY — czyste funkcje pochodne. Nie trzymamy sumy w stanie.
// ---------------------------------------------------------------------------

type ItemLike = { quantity: unknown; unitPrice: unknown }

export function calculateTotal(items: ItemLike[]): number {
    return items.reduce((sum, item) => {
        const qty = Number(item.quantity)
        const price = Number(item.unitPrice)

        // pola w trakcie edycji bywają puste albo NaN — pomijamy je,
        // żeby licznik nie pokazywał NaN podczas pisania
        if (Number.isNaN(qty) || Number.isNaN(price)) return sum

        return sum + qty * price
    }, 0)
}

export function applyDiscount(total: number, code: string | undefined): number {
    if (code?.trim().toUpperCase() === "SAVE10" && total >= 100) {
        return total * 0.9
    }
    return total
}

// ---------------------------------------------------------------------------
// WARIANT Z .check() — nowe API Zoda 4
//
// .check() zastępuje .superRefine(). Dwie różnice:
//   - zamiast ctx.addIssue(...) robisz ctx.issues.push(...)
//   - callback dostaje ctx z polem `value` zamiast osobnego argumentu z danymi
//
// .check((ctx) => {
//     const data = ctx.value
//
//     if (data.paymentMethod === "card" && !data.cardNumber) {
//         ctx.issues.push({
//             code: "custom",
//             message: "Numer karty jest wymagany przy płatności kartą",
//             path: ["cardNumber"],
//             input: data.cardNumber,   // ← w .check() trzeba podać input
//         })
//     }
// })
//
// Na razie superRefine jest tylko deprecated, więc nie ma pośpiechu.
// Warto wiedzieć, że to nadchodzący standard.
// ---------------------------------------------------------------------------