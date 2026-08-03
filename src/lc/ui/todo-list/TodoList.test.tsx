import {describe, it, expect} from "vitest"
import {render, screen} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {TodoList} from "./TodoList"

// ============================================================
// TESTY KOMPONENTU (RTL).
// Reguły są pokryte unitami, więc tu sprawdzamy, czy komponent
// poprawnie ich UŻYWA i czy user widzi właściwy rezultat.
//
// UWAGA: te testy zakładają aria-label na checkboxach i przyciskach
// usuwania, np.:
//   <input type="checkbox" aria-label={`Oznacz: ${todo.text}`} .../>
//   <button aria-label={`Usuń: ${todo.text}`}>delete</button>
// Bez tego trzeba by sięgać po getAllByRole(...)[index], co jest kruche.
// ============================================================

// helper — dodaje zadanie przez UI, żeby nie powtarzać trzech linijek
async function addTodo(user: ReturnType<typeof userEvent.setup>, text: string) {
    await user.type(screen.getByRole("textbox"), text)
    await user.click(screen.getByRole("button", {name: "dodaj"}))
}


describe("TodoList", () => {

    it("starts with an empty list", () => {
        render(<TodoList/>)

        expect(screen.getByText("ukończono: 0 z 0")).toBeInTheDocument()
        expect(screen.queryAllByRole("listitem")).toHaveLength(0)
    })

    // ---------- DODAWANIE ----------
    it("adds a todo and clears the input", async () => {
        const user = userEvent.setup()
        render(<TodoList/>)

        await addTodo(user, "Kupić mleko")

        expect(screen.getByText("Kupić mleko")).toBeInTheDocument()
        expect(screen.getByRole("textbox")).toHaveValue("")   // input wyczyszczony
    })

    it("does not add an empty todo", async () => {
        const user = userEvent.setup()
        render(<TodoList/>)

        await user.click(screen.getByRole("button", {name: "dodaj"}))

        expect(screen.queryAllByRole("listitem")).toHaveLength(0)
    })

    it("does not add a whitespace-only todo", async () => {
        // sprawdza, czy walidacja leci PO trim
        const user = userEvent.setup()
        render(<TodoList/>)

        await addTodo(user, "   ")

        expect(screen.queryAllByRole("listitem")).toHaveLength(0)
    })

    it("adds multiple todos", async () => {
        const user = userEvent.setup()
        render(<TodoList/>)

        await addTodo(user, "Pierwsze")
        await addTodo(user, "Drugie")

        expect(screen.getAllByRole("listitem")).toHaveLength(2)
        expect(screen.getByText("ukończono: 0 z 2")).toBeInTheDocument()
    })

    // ---------- TOGGLE ----------
    it("marks a todo as done and updates the counter", async () => {
        const user = userEvent.setup()
        render(<TodoList/>)

        await addTodo(user, "Zadanie")
        await user.click(screen.getByRole("checkbox", {name: /Zadanie/}))

        expect(screen.getByRole("checkbox", {name: /Zadanie/})).toBeChecked()
        expect(screen.getByText("ukończono: 1 z 1")).toBeInTheDocument()
    })

    it("unmarks a todo when clicked twice", async () => {
        const user = userEvent.setup()
        render(<TodoList/>)

        await addTodo(user, "Zadanie")
        const checkbox = screen.getByRole("checkbox", {name: /Zadanie/})

        await user.click(checkbox)
        await user.click(checkbox)

        expect(checkbox).not.toBeChecked()
        expect(screen.getByText("ukończono: 0 z 1")).toBeInTheDocument()
    })

    // ---------- USUWANIE ----------
    it("deletes a todo", async () => {
        const user = userEvent.setup()
        render(<TodoList/>)

        await addTodo(user, "Do usunięcia")
        await user.click(screen.getByRole("button", {name: /Usuń: Do usunięcia/}))

        expect(screen.queryByText("Do usunięcia")).not.toBeInTheDocument()
    })

    it("deletes only completed todos", async () => {
        const user = userEvent.setup()
        render(<TodoList/>)

        await addTodo(user, "Zrobione")
        await addTodo(user, "Niezrobione")
        await user.click(screen.getByRole("checkbox", {name: /Zrobione/}))

        await user.click(screen.getByRole("button", {name: /usun ukonczone/i}))

        expect(screen.queryByText("Zrobione")).not.toBeInTheDocument()
        expect(screen.getByText("Niezrobione")).toBeInTheDocument()
    })

    // ---------- FILTROWANIE ----------
    it("shows only active todos for the 'active' filter", async () => {
        const user = userEvent.setup()
        render(<TodoList/>)

        await addTodo(user, "Zrobione")
        await addTodo(user, "Niezrobione")
        await user.click(screen.getByRole("checkbox", {name: /Zrobione/}))

        await user.click(screen.getByRole("button", {name: "niezakonczone"}))

        expect(screen.queryByText("Zrobione")).not.toBeInTheDocument()
        expect(screen.getByText("Niezrobione")).toBeInTheDocument()
    })

    it("shows only completed todos for the 'completed' filter", async () => {
        const user = userEvent.setup()
        render(<TodoList/>)

        await addTodo(user, "Zrobione")
        await addTodo(user, "Niezrobione")
        await user.click(screen.getByRole("checkbox", {name: /Zrobione/}))

        await user.click(screen.getByRole("button", {name: "zakonczone"}))

        expect(screen.getByText("Zrobione")).toBeInTheDocument()
        expect(screen.queryByText("Niezrobione")).not.toBeInTheDocument()
    })

    it("brings hidden todos back when switching to 'all'", async () => {
        // KLUCZOWY test — filtr ukrywa, a nie usuwa.
        // Gdyby reducer zapisywał przefiltrowaną listę, ten test by padł.
        const user = userEvent.setup()
        render(<TodoList/>)

        await addTodo(user, "Zrobione")
        await addTodo(user, "Niezrobione")
        await user.click(screen.getByRole("checkbox", {name: /Zrobione/}))

        await user.click(screen.getByRole("button", {name: "zakonczone"}))
        await user.click(screen.getByRole("button", {name: "wszystkie"}))

        expect(screen.getByText("Zrobione")).toBeInTheDocument()
        expect(screen.getByText("Niezrobione")).toBeInTheDocument()
    })

    it("keeps the counter based on all todos, not the filtered ones", async () => {
        const user = userEvent.setup()
        render(<TodoList/>)

        await addTodo(user, "Zrobione")
        await addTodo(user, "Niezrobione")
        await user.click(screen.getByRole("checkbox", {name: /Zrobione/}))

        await user.click(screen.getByRole("button", {name: "zakonczone"}))

        // licznik liczy z PEŁNEJ listy, mimo że widać tylko jedno zadanie
        expect(screen.getByText("ukończono: 1 z 2")).toBeInTheDocument()
    })
})