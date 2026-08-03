import {describe, it, expect} from "vitest"
import {render, screen} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {Cart} from "./Cart"

// ============================================================
// TESTY KOMPONENTU (RTL) — testujemy ZACHOWANIE.
// Reguły koszyka są już pokryte unit testami reducera,
// więc tutaj sprawdzamy, czy komponent poprawnie ich UŻYWA:
// czy klik dispatchuje właściwą akcję i czy wynik widać na ekranie.
// ============================================================

describe("Cart", () => {

    it("shows a message when the cart is empty", () => {
        render(<Cart/>)

        expect(screen.getByText("Koszyk jest pusty")).toBeInTheDocument()
    })

    it("adds a product to the cart on Dodaj click", async () => {
        const user = userEvent.setup()
        render(<Cart/>)

        // getAllByRole -> jest kilka przycisków "Dodaj", bierzemy pierwszy (Klawiatura)
        await user.click(screen.getAllByRole("button", {name: "Dodaj"})[0])

        expect(screen.queryByText("Koszyk jest pusty")).not.toBeInTheDocument()
        expect(screen.getByText("Suma: 250 zł")).toBeInTheDocument()
    })

    it("increases quantity instead of duplicating the row", async () => {
        const user = userEvent.setup()
        render(<Cart/>)

        const addKeyboard = screen.getAllByRole("button", {name: "Dodaj"})[0]
        await user.click(addKeyboard)
        await user.click(addKeyboard)

        // suma potwierdza ilość 2 (250 * 2)
        expect(screen.getByText("Suma: 500 zł")).toBeInTheDocument()
        // tylko JEDEN przycisk usuwania -> jedna pozycja w koszyku
        expect(screen.getAllByRole("button", {name: /^Usuń:/})).toHaveLength(1)
    })

    it("sums up different products", async () => {
        const user = userEvent.setup()
        render(<Cart/>)

        const addButtons = screen.getAllByRole("button", {name: "Dodaj"})
        await user.click(addButtons[0])   // Klawiatura 250
        await user.click(addButtons[1])   // Mysz 120

        expect(screen.getByText("Suma: 370 zł")).toBeInTheDocument()
    })

    it("increments and decrements quantity with +/- buttons", async () => {
        const user = userEvent.setup()
        render(<Cart/>)

        await user.click(screen.getAllByRole("button", {name: "Dodaj"})[0])

        await user.click(screen.getByRole("button", {name: "Zwiększ ilość: Klawiatura"}))
        expect(screen.getByText("Suma: 500 zł")).toBeInTheDocument()

        await user.click(screen.getByRole("button", {name: "Zmniejsz ilość: Klawiatura"}))
        expect(screen.getByText("Suma: 250 zł")).toBeInTheDocument()
    })

    it("removes the row when quantity drops to zero", async () => {
        const user = userEvent.setup()
        render(<Cart/>)

        await user.click(screen.getAllByRole("button", {name: "Dodaj"})[0])
        await user.click(screen.getByRole("button", {name: "Zmniejsz ilość: Klawiatura"}))

        expect(screen.getByText("Koszyk jest pusty")).toBeInTheDocument()
    })

    it("removes the row with the Usuń button", async () => {
        const user = userEvent.setup()
        render(<Cart/>)

        await user.click(screen.getAllByRole("button", {name: "Dodaj"})[0])
        await user.click(screen.getByRole("button", {name: "Usuń: Klawiatura"}))

        expect(screen.getByText("Koszyk jest pusty")).toBeInTheDocument()
    })

    it("clears the whole cart", async () => {
        const user = userEvent.setup()
        render(<Cart/>)

        const addButtons = screen.getAllByRole("button", {name: "Dodaj"})
        await user.click(addButtons[0])
        await user.click(addButtons[1])

        await user.click(screen.getByRole("button", {name: "Wyczyść koszyk"}))

        expect(screen.getByText("Koszyk jest pusty")).toBeInTheDocument()
    })
})