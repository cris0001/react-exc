import {describe, it, expect, vi, beforeEach} from "vitest"
import {render, screen, within} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {OrderForm} from "./OrderForm"
import {submitOrder} from "./api"

// warstwa API zamockowana — testy nie czekają na "sieć"
vi.mock("./api", () => ({
    submitOrder: vi.fn(),
}))

const mockSubmit = vi.mocked(submitOrder)

// ============================================================================
// TESTY KOMPONENTU — reguły walidacji są już pokryte w schema.test.ts,
// więc tutaj sprawdzamy ZACHOWANIE: dynamiczne pola, warunkowe renderowanie,
// licznik na żywo i to, czy poprawne dane trafiają do API.
// ============================================================================

// helper — wypełnia pierwszą pozycję
async function fillFirstItem(
    user: ReturnType<typeof userEvent.setup>,
    desc: string,
    qty: string,
    price: string,
) {
    await user.type(screen.getByLabelText("Opis"), desc)

    const qtyInput = screen.getByLabelText("Ilość")
    await user.clear(qtyInput)
    await user.type(qtyInput, qty)

    const priceInput = screen.getByLabelText("Cena")
    await user.clear(priceInput)
    await user.type(priceInput, price)
}


describe("OrderForm", () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })

    // ---------- POLA DYNAMICZNE ----------
    it("starts with exactly one line item", () => {
        render(<OrderForm/>)

        expect(screen.getAllByLabelText("Opis")).toHaveLength(1)
    })

    it("adds a line item", async () => {
        const user = userEvent.setup()
        render(<OrderForm/>)

        await user.click(screen.getByRole("button", {name: "Dodaj pozycję"}))

        expect(screen.getAllByLabelText("Opis")).toHaveLength(2)
    })

    it("removes a line item", async () => {
        const user = userEvent.setup()
        render(<OrderForm/>)

        await user.click(screen.getByRole("button", {name: "Dodaj pozycję"}))
        await user.click(screen.getByRole("button", {name: "Usuń pozycję 2"}))

        expect(screen.getAllByLabelText("Opis")).toHaveLength(1)
    })

    it("disables removing the last remaining item", () => {
        // WARTOŚĆ GRANICZNA — nie można zostać z zerem pozycji
        render(<OrderForm/>)

        expect(screen.getByRole("button", {name: "Usuń pozycję 1"})).toBeDisabled()
    })

    it("keeps the values of the remaining items after a removal", async () => {
        // TO ŁAPIE BUG Z KLUCZAMI — gdyby key był indeksem, po usunięciu
        // wartości przeskoczyłyby do niewłaściwych wierszy
        const user = userEvent.setup()
        render(<OrderForm/>)

        await user.click(screen.getByRole("button", {name: "Dodaj pozycję"}))

        const descriptions = screen.getAllByLabelText("Opis")
        await user.type(descriptions[0], "Pierwsza")
        await user.type(descriptions[1], "Druga")

        // usuwamy PIERWSZĄ — druga ma zostać nietknięta
        await user.click(screen.getByRole("button", {name: "Usuń pozycję 1"}))

        expect(screen.getByLabelText("Opis")).toHaveValue("Druga")
    })

    // ---------- POLE WARUNKOWE ----------
    it("hides the card number field for bank transfer", () => {
        render(<OrderForm/>)

        expect(screen.queryByLabelText("Numer karty")).not.toBeInTheDocument()
    })

    it("shows the card number field when card is selected", async () => {
        const user = userEvent.setup()
        render(<OrderForm/>)

        await user.selectOptions(screen.getByLabelText("Metoda płatności"), "card")

        expect(screen.getByLabelText("Numer karty")).toBeInTheDocument()
    })

    // ---------- LICZNIK NA ŻYWO ----------
    it("updates the total as the user types", async () => {
        const user = userEvent.setup()
        render(<OrderForm/>)

        await fillFirstItem(user, "Klawiatura", "2", "150")

        expect(screen.getByText("Suma:")).toBeInTheDocument()
        expect(screen.getByText("300.00 zł")).toBeInTheDocument()
    })

    it("shows the discounted total when a valid code is entered", async () => {
        const user = userEvent.setup()
        render(<OrderForm/>)

        await fillFirstItem(user, "Klawiatura", "2", "150")
        await user.type(screen.getByLabelText("Kod rabatowy"), "SAVE10")

        expect(screen.getByText("Po rabacie: 270.00 zł")).toBeInTheDocument()
    })

    // ---------- WALIDACJA ----------
    it("blocks submit and shows errors for empty required fields", async () => {
        const user = userEvent.setup()
        render(<OrderForm/>)

        await user.click(screen.getByRole("button", {name: "Złóż zamówienie"}))

        expect(await screen.findByText("Email jest wymagany")).toBeInTheDocument()
        expect(mockSubmit).not.toHaveBeenCalled()   // request NIE poszedł
    })

    it("shows the cross-field card error when paying by card", async () => {
        const user = userEvent.setup()
        render(<OrderForm/>)

        await user.type(screen.getByLabelText("Email"), "jan@example.com")
        await fillFirstItem(user, "Klawiatura", "1", "100")
        await user.selectOptions(screen.getByLabelText("Metoda płatności"), "card")

        await user.click(screen.getByRole("button", {name: "Złóż zamówienie"}))

        expect(await screen.findByText("Numer karty jest wymagany przy płatności kartą"))
            .toBeInTheDocument()
        expect(mockSubmit).not.toHaveBeenCalled()
    })

    it("shows the cross-field discount error below the threshold", async () => {
        const user = userEvent.setup()
        render(<OrderForm/>)

        await user.type(screen.getByLabelText("Email"), "jan@example.com")
        await fillFirstItem(user, "Klawiatura", "1", "50")
        await user.type(screen.getByLabelText("Kod rabatowy"), "SAVE10")

        await user.click(screen.getByRole("button", {name: "Złóż zamówienie"}))

        expect(await screen.findByText("Kod SAVE10 wymaga zamówienia za min. 100 zł"))
            .toBeInTheDocument()
    })

    // ---------- HAPPY PATH ----------
    it("submits the parsed values and shows success", async () => {
        mockSubmit.mockResolvedValue({id: 1})

        const user = userEvent.setup()
        render(<OrderForm/>)

        await user.type(screen.getByLabelText("Email"), "jan@example.com")
        await fillFirstItem(user, "Klawiatura", "2", "150")

        await user.click(screen.getByRole("button", {name: "Złóż zamówienie"}))

        // liczby są już LICZBAMI, nie stringami — dowód, że z.coerce zadziałało
        await vi.waitFor(() => {
            expect(mockSubmit).toHaveBeenCalledWith(
                expect.objectContaining({
                    email: "jan@example.com",
                    items: [expect.objectContaining({
                        description: "Klawiatura",
                        quantity: 2,
                        unitPrice: 150,
                    })],
                })
            )
        })

        expect(await screen.findByText("Zamówienie przyjęte.")).toBeInTheDocument()
    })

    it("shows a server error without losing entered values", async () => {
        mockSubmit.mockRejectedValue(new Error("Ten adres email jest zablokowany"))

        const user = userEvent.setup()
        render(<OrderForm/>)

        await user.type(screen.getByLabelText("Email"), "jan@blocked.com")
        await fillFirstItem(user, "Klawiatura", "1", "100")

        await user.click(screen.getByRole("button", {name: "Złóż zamówienie"}))

        expect(await screen.findByText("Ten adres email jest zablokowany")).toBeInTheDocument()
        expect(screen.getByLabelText("Email")).toHaveValue("jan@blocked.com")
    })
})
