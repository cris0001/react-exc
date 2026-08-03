import {describe, it, expect} from "vitest"
import {ticketSchema} from "./schema"

// ============================================================================
// UNIT TESTY WALIDACJI MIĘDZY POLAMI.
// Sedno: wymagalność pola zależy od wartości `type`.
// ============================================================================

const validBug = {
    title: "Przycisk nie działa",
    category: "ui",
    type: "bug" as const,
    stepsToReproduce: "Kliknij zapisz, nic się nie dzieje",
    businessValue: "",
}

const validFeature = {
    title: "Eksport do CSV",
    category: "api",
    type: "feature" as const,
    stepsToReproduce: "",
    businessValue: "Klienci proszą o to od miesięcy",
}

function errorFor(result: ReturnType<typeof ticketSchema.safeParse>, path: string) {
    if (result.success) return undefined
    return result.error.issues.find((i) => i.path.join(".") === path)?.message
}


describe("ticketSchema — pola wspólne", () => {

    it("accepts a valid bug", () => {
        expect(ticketSchema.safeParse(validBug).success).toBe(true)
    })

    it("accepts a valid feature", () => {
        expect(ticketSchema.safeParse(validFeature).success).toBe(true)
    })

    it("rejects a title shorter than 3 chars", () => {
        const result = ticketSchema.safeParse({...validBug, title: "ab"})

        expect(errorFor(result, "title")).toBe("Tytuł musi mieć co najmniej 3 znaki")
    })

    it("accepts a title of exactly 3 chars", () => {
        // WARTOŚĆ GRANICZNA
        expect(ticketSchema.safeParse({...validBug, title: "abc"}).success).toBe(true)
    })

    it("rejects a title longer than 80 chars", () => {
        const result = ticketSchema.safeParse({...validBug, title: "x".repeat(81)})

        expect(errorFor(result, "title")).toBe("Tytuł może mieć maksymalnie 80 znaków")
    })

    it("rejects an empty category", () => {
        const result = ticketSchema.safeParse({...validBug, category: ""})

        expect(errorFor(result, "category")).toBe("Wybierz kategorię")
    })

    it("rejects an unknown type", () => {
        const result = ticketSchema.safeParse({...validBug, type: "question"})

        expect(result.success).toBe(false)
    })
})


describe("ticketSchema — wariant bug", () => {

    it("requires stepsToReproduce", () => {
        const result = ticketSchema.safeParse({...validBug, stepsToReproduce: ""})

        expect(errorFor(result, "stepsToReproduce"))
            .toBe("Opisz kroki w co najmniej 10 znakach")
    })

    it("rejects stepsToReproduce shorter than 10 chars", () => {
        const result = ticketSchema.safeParse({...validBug, stepsToReproduce: "krótkie"})

        expect(errorFor(result, "stepsToReproduce")).toBeDefined()
    })

    it("accepts exactly 10 chars", () => {
        // WARTOŚĆ GRANICZNA
        const result = ticketSchema.safeParse({...validBug, stepsToReproduce: "1234567890"})

        expect(result.success).toBe(true)
    })

    it("rejects whitespace-only steps", () => {
        // trim() w walidacji — 15 spacji to nie jest opis
        const result = ticketSchema.safeParse({...validBug, stepsToReproduce: "               "})

        expect(errorFor(result, "stepsToReproduce")).toBeDefined()
    })

    it("does NOT require businessValue for a bug", () => {
        // SEDNO — pole drugiego wariantu jest tu nieistotne
        const result = ticketSchema.safeParse({...validBug, businessValue: ""})

        expect(result.success).toBe(true)
        expect(errorFor(result, "businessValue")).toBeUndefined()
    })
})


describe("ticketSchema — wariant feature", () => {

    it("requires businessValue", () => {
        const result = ticketSchema.safeParse({...validFeature, businessValue: ""})

        expect(errorFor(result, "businessValue"))
            .toBe("Opisz wartość biznesową w co najmniej 10 znakach")
    })

    it("rejects businessValue shorter than 10 chars", () => {
        const result = ticketSchema.safeParse({...validFeature, businessValue: "mało"})

        expect(errorFor(result, "businessValue")).toBeDefined()
    })

    it("does NOT require stepsToReproduce for a feature", () => {
        const result = ticketSchema.safeParse({...validFeature, stepsToReproduce: ""})

        expect(result.success).toBe(true)
        expect(errorFor(result, "stepsToReproduce")).toBeUndefined()
    })
})


describe("ticketSchema — przełączanie typu", () => {

    it("validates the OTHER field after switching type", () => {
        // te same dane, inny type -> błąd wędruje na drugie pole.
        // To dowód, że reguła faktycznie zależy od `type`.
        const data = {
            title: "Coś",
            category: "ui",
            stepsToReproduce: "Wystarczająco długi opis kroków",
            businessValue: "",
        }

        const asBug = ticketSchema.safeParse({...data, type: "bug"})
        const asFeature = ticketSchema.safeParse({...data, type: "feature"})

        expect(asBug.success).toBe(true)
        expect(errorFor(asFeature, "businessValue")).toBeDefined()
    })
})
