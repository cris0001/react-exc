import {z} from "zod"

// ============================================================================
// SCHEMA — PŁASKI OBIEKT + superRefine (Zod 4)
//
// Wersja z z.discriminatedUnion też by działała i ładniej wyrażałaby
// "kształt zależy od typu", ale gryzie się z RHF: useForm<T> zakłada,
// że T opisuje WSZYSTKIE możliwe pola, bo register("nazwa") musi być
// sprawdzalne statycznie. Unia mówi "albo te pola, albo tamte" — i TS
// nie wie, który wariant jest aktywny przy wywołaniu register.
//
// PRAKTYCZNY PODZIAŁ:
//   dane wchodzące (API, config, searchParams) -> discriminatedUnion
//   formularz w RHF                             -> płaski obiekt + superRefine
// ============================================================================

export const CATEGORIES = [
    {value: "ui", label: "Interfejs"},
    {value: "api", label: "API"},
    {value: "docs", label: "Dokumentacja"},
] as const

export const ticketSchema = z
    .object({
        title: z
            .string()
            .min(3, {error: "Tytuł musi mieć co najmniej 3 znaki"})
            .max(80, {error: "Tytuł może mieć maksymalnie 80 znaków"}),

        category: z
            .string()
            .min(1, {error: "Wybierz kategorię"}),

        // enum zamiast literałów — pole ma dwie dopuszczalne wartości,
        // ale NIE decyduje o typie całego obiektu (bo obiekt jest płaski)
        type: z.enum(["bug", "feature"]),

        // Oba pola opcjonalne na poziomie pojedynczego pola.
        // Wymagalność zależy od `type`, czyli od INNEGO pola —
        // a tego nie da się wyrazić inaczej niż w superRefine.
        stepsToReproduce: z.string().optional(),
        businessValue: z.string().optional(),
    })
    .superRefine((data, ctx) => {
        if (data.type === "bug") {
            // ?? "" bo pole jest opcjonalne — bez tego .length na undefined
            if ((data.stepsToReproduce ?? "").trim().length < 10) {
                ctx.addIssue({
                    code: "custom",
                    message: "Opisz kroki w co najmniej 10 znakach",
                    path: ["stepsToReproduce"],   // ← przypina błąd do TEGO pola
                })
            }
        } else {
            if ((data.businessValue ?? "").trim().length < 10) {
                ctx.addIssue({
                    code: "custom",
                    message: "Opisz wartość biznesową w co najmniej 10 znakach",
                    path: ["businessValue"],
                })
            }
        }
    })

// Typ WYNIKA ze schemy — zero ręcznego pisania, zero rzutowań w useForm.
// To jest cały zysk z przejścia na płaski obiekt.
export type TicketFormValues = z.input<typeof ticketSchema>
export type Ticket = z.output<typeof ticketSchema>

export const defaultValues: TicketFormValues = {
    title: "",
    category: "",
    type: "bug",
    stepsToReproduce: "",
    businessValue: "",
}

// ---------------------------------------------------------------------------
// CO TRACIMY WZGLĘDEM discriminatedUnion
//
// TypeScript NIE zawęża już typu po polu `type`:
//
//   if (ticket.type === "bug") {
//       ticket.stepsToReproduce   // typ: string | undefined, nie string
//   }
//
// Przy unii TS wiedziałby, że przy "bug" to pole na pewno istnieje.
// Tutaj musisz temu ufać, bo gwarancję daje superRefine w RUNTIME,
// a nie system typów.
//
// W praktyce: dla formularza to akceptowalne, bo i tak wysyłasz dane
// do API, które zwaliduje je po swojej stronie. Gdybyś ten sam kształt
// ODBIERAŁ (odpowiedź API), union byłby lepszym wyborem.
// ---------------------------------------------------------------------------
