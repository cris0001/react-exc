import {describe, it, expect} from "vitest"
import {orderSchema, calculateTotal, applyDiscount} from "./schema"

// ============================================================================
// UNIT TESTY SCHEMY — zero Reacta, zero renderowania.
// To jest największy zysk z wyciągnięcia walidacji do osobnego pliku:
// reguły (zwłaszcza te MIĘDZY polami) testujesz wprost, wejście -> wyjście.
// ============================================================================

// bazowe poprawne dane — każdy test nadpisuje tylko to, co bada
const validOrder = {
    email: "jan@example.com",
    items: [{description: "Klawiatura", quantity: 2, unitPrice: 150}],
    paymentMethod: "transfer" as const,
    cardNumber: "",
    discountCode: "",
}

// helper — zwraca komunikat błędu dla danego pola albo undefined
function errorFor(result: ReturnType<typeof orderSchema.safeParse>, path: string) {
    if (result.success) return undefined
    return result.error.issues.find(i => i.path.join(".") === path)?.message
}


describe("orderSchema — pola podstawowe", () => {

    it("accepts a valid order", () => {
        expect(orderSchema.safeParse(validOrder).success).toBe(true)
    })

    it("rejects an empty email", () => {
        const result = orderSchema.safeParse({...validOrder, email: ""})

        expect(result.success).toBe(false)
        expect(errorFor(result, "email")).toBe("Email jest wymagany")
    })

    it("rejects a malformed email", () => {
        const result = orderSchema.safeParse({...validOrder, email: "jan@"})

        expect(errorFor(result, "email")).toBe("Nieprawidłowy format email")
    })

    it("rejects an order with no items", () => {
        const result = orderSchema.safeParse({...validOrder, items: []})

        expect(errorFor(result, "items")).toBe("Zamówienie musi mieć co najmniej jedną pozycję")
    })
})


describe("orderSchema — pozycje", () => {

    it("rejects an item with an empty description", () => {
        const result = orderSchema.safeParse({
            ...validOrder,
            items: [{description: "", quantity: 1, unitPrice: 10}],
        })

        expect(errorFor(result, "items.0.description")).toBe("Opis jest wymagany")
    })

    it("rejects quantity below 1", () => {
        // WARTOŚĆ GRANICZNA — tu żyje bug < vs <=
        const result = orderSchema.safeParse({
            ...validOrder,
            items: [{description: "X", quantity: 0, unitPrice: 10}],
        })

        expect(errorFor(result, "items.0.quantity")).toBe("Ilość musi być co najmniej 1")
    })

    it("accepts quantity of exactly 1", () => {
        const result = orderSchema.safeParse({
            ...validOrder,
            items: [{description: "X", quantity: 1, unitPrice: 10}],
        })

        expect(result.success).toBe(true)
    })

    it("rejects a non-integer quantity", () => {
        const result = orderSchema.safeParse({
            ...validOrder,
            items: [{description: "X", quantity: 1.5, unitPrice: 10}],
        })

        expect(errorFor(result, "items.0.quantity")).toBe("Ilość musi być liczbą całkowitą")
    })

    it("rejects a unit price of zero", () => {
        const result = orderSchema.safeParse({
            ...validOrder,
            items: [{description: "X", quantity: 1, unitPrice: 0}],
        })

        expect(errorFor(result, "items.0.unitPrice")).toBe("Cena musi być większa od zera")
    })

    it("coerces numeric strings from inputs", () => {
        // inputy HTML zawsze zwracają string — bez z.coerce schema by odrzuciła
        const result = orderSchema.safeParse({
            ...validOrder,
            items: [{description: "X", quantity: "3", unitPrice: "25.50"}],
        })

        expect(result.success).toBe(true)
        if (result.success) {
            expect(result.data.items[0].quantity).toBe(3)        // już number
            expect(result.data.items[0].unitPrice).toBe(25.5)
        }
    })

    it("reports the error on the right item index", () => {
        const result = orderSchema.safeParse({
            ...validOrder,
            items: [
                {description: "OK", quantity: 1, unitPrice: 10},
                {description: "", quantity: 1, unitPrice: 10},   // błąd w DRUGIEJ
            ],
        })

        expect(errorFor(result, "items.0.description")).toBeUndefined()
        expect(errorFor(result, "items.1.description")).toBe("Opis jest wymagany")
    })
})


describe("orderSchema — walidacja MIĘDZY polami", () => {

    it("does not require a card number for bank transfer", () => {
        const result = orderSchema.safeParse({
            ...validOrder,
            paymentMethod: "transfer",
            cardNumber: "",
        })

        expect(result.success).toBe(true)
    })

    it("requires a card number when paying by card", () => {
        // TO JEST SEDNO — wymagalność pola zależy od INNEGO pola
        const result = orderSchema.safeParse({
            ...validOrder,
            paymentMethod: "card",
            cardNumber: "",
        })

        expect(errorFor(result, "cardNumber"))
            .toBe("Numer karty jest wymagany przy płatności kartą")
    })

    it("rejects a card number that is not 16 digits", () => {
        const result = orderSchema.safeParse({
            ...validOrder,
            paymentMethod: "card",
            cardNumber: "1234",
        })

        expect(errorFor(result, "cardNumber")).toBe("Numer karty musi mieć 16 cyfr")
    })

    it("accepts a 16-digit card number with spaces", () => {
        const result = orderSchema.safeParse({
            ...validOrder,
            paymentMethod: "card",
            cardNumber: "1234 5678 9012 3456",
        })

        expect(result.success).toBe(true)
    })

    it("rejects an unknown discount code", () => {
        const result = orderSchema.safeParse({...validOrder, discountCode: "XYZ"})

        expect(errorFor(result, "discountCode")).toBe("Nieprawidłowy kod rabatowy")
    })

    it("rejects SAVE10 when the total is below the threshold", () => {
        // reguła zależy od SUMY, która wynika z tablicy pozycji
        const result = orderSchema.safeParse({
            ...validOrder,
            items: [{description: "X", quantity: 1, unitPrice: 50}],   // suma 50
            discountCode: "SAVE10",
        })

        expect(errorFor(result, "discountCode"))
            .toBe("Kod SAVE10 wymaga zamówienia za min. 100 zł")
    })

    it("accepts SAVE10 at exactly the threshold", () => {
        // WARTOŚĆ GRANICZNA — 100 ma przejść (>=, nie >)
        const result = orderSchema.safeParse({
            ...validOrder,
            items: [{description: "X", quantity: 1, unitPrice: 100}],
            discountCode: "SAVE10",
        })

        expect(result.success).toBe(true)
    })

    it("is case-insensitive for the discount code", () => {
        const result = orderSchema.safeParse({
            ...validOrder,
            items: [{description: "X", quantity: 1, unitPrice: 200}],
            discountCode: "save10",
        })

        expect(result.success).toBe(true)
    })

    it("reports both cross-field errors at once", () => {
        // superRefine (w przeciwieństwie do refine) może dodać KILKA błędów
        const result = orderSchema.safeParse({
            ...validOrder,
            items: [{description: "X", quantity: 1, unitPrice: 10}],   // suma 10
            paymentMethod: "card",
            cardNumber: "",
            discountCode: "SAVE10",
        })

        expect(errorFor(result, "cardNumber")).toBeDefined()
        expect(errorFor(result, "discountCode")).toBeDefined()
    })
})


describe("calculateTotal", () => {

    it("returns 0 for an empty list", () => {
        expect(calculateTotal([])).toBe(0)
    })

    it("multiplies quantity by unit price", () => {
        expect(calculateTotal([{quantity: 3, unitPrice: 10}])).toBe(30)
    })

    it("sums multiple items", () => {
        expect(calculateTotal([
            {quantity: 2, unitPrice: 10},
            {quantity: 1, unitPrice: 5},
        ])).toBe(25)
    })

    it("ignores items with non-numeric values", () => {
        // podczas pisania pole bywa puste — licznik nie może pokazać NaN
        expect(calculateTotal([
            {quantity: 2, unitPrice: 10},
            {quantity: "", unitPrice: ""},
        ])).toBe(20)
    })
})


describe("applyDiscount", () => {

    it("returns the total unchanged without a code", () => {
        expect(applyDiscount(200, undefined)).toBe(200)
    })

    it("applies 10% for SAVE10 above the threshold", () => {
        expect(applyDiscount(200, "SAVE10")).toBe(180)
    })

    it("does not apply below the threshold", () => {
        expect(applyDiscount(50, "SAVE10")).toBe(50)
    })

    it("ignores an unknown code", () => {
        expect(applyDiscount(200, "NOPE")).toBe(200)
    })
})
