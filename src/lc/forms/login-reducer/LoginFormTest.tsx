import {describe, it, expect, vi, beforeEach} from "vitest"
import {render, screen} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {LoginForm} from "./LoginForm"
import {login} from "./api"

// ============================================================
// TESTY KOMPONENTU (RTL) — testujemy ZACHOWANIE, nie implementację.
// Szukamy elementów tak, jak widzi je user (rola, etykieta, tekst),
// nie po className czy id.
// ============================================================

// MOCK modułu api — LoginForm dostanie atrapę zamiast prawdziwego login.
// Dzięki temu: nie czekamy 1s, kontrolujemy wynik, sprawdzamy wywołania.
vi.mock("./api", () => ({
    login: vi.fn(),
}))

// rzutowanie, żeby TS wiedział, że to mock (ma .mockResolvedValue itd.)
const mockLogin = vi.mocked(login)

describe("LoginForm", () => {

    beforeEach(() => {
        vi.clearAllMocks()   // czyść zapisane wywołania między testami
    })

    // ---------- WALIDACJA ----------
    it("pokazuje błędy walidacji i nie wywołuje login", async () => {
        const user = userEvent.setup()
        render(<LoginForm/>)

        // submit z pustymi polami
        await user.click(screen.getByRole("button", {name: /zaloguj/i}))

        expect(screen.getByText("Email jest wymagany")).toBeInTheDocument()
        expect(screen.getByText("Hasło jest wymagane")).toBeInTheDocument()
        expect(mockLogin).not.toHaveBeenCalled()
    })

    it("pokazuje błąd formatu przy niepoprawnym emailu", async () => {
        const user = userEvent.setup()
        render(<LoginForm/>)

        await user.type(screen.getByLabelText("Email"), "zlyemail")
        await user.type(screen.getByLabelText("Hasło"), "haslo123")
        await user.click(screen.getByRole("button", {name: /zaloguj/i}))

        expect(screen.getByText("Nieprawidłowy format email")).toBeInTheDocument()
        expect(mockLogin).not.toHaveBeenCalled()
    })

    // ---------- HAPPY PATH ----------
    it("wywołuje login z wpisanymi danymi i pokazuje sukces", async () => {
        mockLogin.mockResolvedValue(undefined)   // sukces

        const user = userEvent.setup()
        render(<LoginForm/>)

        await user.type(screen.getByLabelText("Email"), "test@test.pl")
        await user.type(screen.getByLabelText("Hasło"), "haslo123")
        await user.click(screen.getByRole("button", {name: /zaloguj/i}))

        // sprawdzamy, że login dostał WŁAŚCIWE argumenty
        expect(mockLogin).toHaveBeenCalledWith("test@test.pl", "haslo123")

        // findBy* = czeka na pojawienie się (async, po rozwiązaniu Promise)
        expect(await screen.findByText("Zalogowano.")).toBeInTheDocument()
    })

    // ---------- BŁĄD Z API ----------
    it("pokazuje komunikat, gdy login rzuci błąd", async () => {
        mockLogin.mockRejectedValue(new Error("Nieprawidłowy email lub hasło"))

        const user = userEvent.setup()
        render(<LoginForm/>)

        await user.type(screen.getByLabelText("Email"), "test@test.pl")
        await user.type(screen.getByLabelText("Hasło"), "haslo123")
        await user.click(screen.getByRole("button", {name: /zaloguj/i}))

        expect(await screen.findByText("Nieprawidłowy email lub hasło")).toBeInTheDocument()
    })

    // ---------- CZYSZCZENIE BŁĘDU ----------
    it("czyści błąd pola, gdy user zaczyna poprawiać", async () => {
        const user = userEvent.setup()
        render(<LoginForm/>)

        await user.click(screen.getByRole("button", {name: /zaloguj/i}))
        expect(screen.getByText("Email jest wymagany")).toBeInTheDocument()

        await user.type(screen.getByLabelText("Email"), "a")

        // queryBy* = zwraca null zamiast rzucać, gdy nie ma -> do sprawdzania BRAKU
        expect(screen.queryByText("Email jest wymagany")).not.toBeInTheDocument()
    })
})