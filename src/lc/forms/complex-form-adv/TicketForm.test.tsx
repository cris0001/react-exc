import {describe, it, expect, vi, beforeEach} from "vitest"
import {render, screen} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {TicketForm} from "./TicketForm"
import {createTicket, FieldError} from "./api"

vi.mock("./api", async (importOriginal) => {
    // importOriginal zachowuje prawdziwą klasę FieldError —
    // podmieniamy TYLKO createTicket. Bez tego instanceof FieldError
    // w komponencie nigdy by nie zadziałał.
    const actual = await importOriginal<typeof import("./api")>()
    return {
        ...actual,
        createTicket: vi.fn(),
    }
})

const mockCreate = vi.mocked(createTicket)

// helper — wypełnia formularz poprawnymi danymi buga
async function fillValidBug(user: ReturnType<typeof userEvent.setup>) {
    await user.type(screen.getByLabelText("Tytuł"), "Przycisk nie działa")
    await user.selectOptions(screen.getByLabelText("Kategoria"), "ui")
    await user.type(
        screen.getByLabelText("Kroki do odtworzenia"),
        "Kliknij zapisz i nic się nie dzieje",
    )
}


describe("TicketForm — Controller", () => {

    beforeEach(() => vi.clearAllMocks())

    it("renders the custom select and lets the user pick a value", async () => {
        const user = userEvent.setup()
        render(<TicketForm/>)

        await user.selectOptions(screen.getByLabelText("Kategoria"), "api")

        expect(screen.getByLabelText("Kategoria")).toHaveValue("api")
    })

    it("validates the Controller-managed field", async () => {
        // dowód, że Controller faktycznie spina komponent z walidacją —
        // bez niego to pole byłoby dla RHF niewidoczne
        const user = userEvent.setup()
        render(<TicketForm/>)

        await user.type(screen.getByLabelText("Tytuł"), "Jakiś tytuł")
        await user.type(screen.getByLabelText("Kroki do odtworzenia"), "Wystarczająco długi opis")
        await user.click(screen.getByRole("button", {name: "Utwórz"}))

        expect(await screen.findByText("Wybierz kategorię")).toBeInTheDocument()
        expect(mockCreate).not.toHaveBeenCalled()
    })

    it("sends the value picked in the custom select", async () => {
        mockCreate.mockResolvedValue({id: 1})

        const user = userEvent.setup()
        render(<TicketForm/>)
        await fillValidBug(user)

        await user.click(screen.getByRole("button", {name: "Utwórz"}))

        await vi.waitFor(() => {
            expect(mockCreate).toHaveBeenCalledWith(
                expect.objectContaining({category: "ui"})
            )
        })
    })
})


describe("TicketForm — pole zależne od typu", () => {

    beforeEach(() => vi.clearAllMocks())

    it("shows the bug field by default", () => {
        render(<TicketForm/>)

        expect(screen.getByLabelText("Kroki do odtworzenia")).toBeInTheDocument()
        expect(screen.queryByLabelText("Wartość biznesowa")).not.toBeInTheDocument()
    })

    it("swaps the field when the type changes", async () => {
        const user = userEvent.setup()
        render(<TicketForm/>)

        await user.click(screen.getByLabelText("Nowa funkcja"))

        expect(screen.getByLabelText("Wartość biznesowa")).toBeInTheDocument()
        expect(screen.queryByLabelText("Kroki do odtworzenia")).not.toBeInTheDocument()
    })

    it("validates the field belonging to the selected variant", async () => {
        const user = userEvent.setup()
        render(<TicketForm/>)

        await user.click(screen.getByLabelText("Nowa funkcja"))
        await user.type(screen.getByLabelText("Tytuł"), "Eksport CSV")
        await user.selectOptions(screen.getByLabelText("Kategoria"), "api")
        await user.type(screen.getByLabelText("Wartość biznesowa"), "krótkie")

        await user.click(screen.getByRole("button", {name: "Utwórz"}))

        expect(await screen.findByText("Opisz wartość biznesową w co najmniej 10 znakach"))
            .toBeInTheDocument()
    })
})


describe("TicketForm — reset", () => {

    beforeEach(() => vi.clearAllMocks())

    it("clears the form after a successful submit", async () => {
        mockCreate.mockResolvedValue({id: 42})

        const user = userEvent.setup()
        render(<TicketForm/>)
        await fillValidBug(user)

        await user.click(screen.getByRole("button", {name: "Utwórz"}))

        expect(await screen.findByText("Utworzono zgłoszenie #42")).toBeInTheDocument()
        expect(screen.getByLabelText("Tytuł")).toHaveValue("")
        expect(screen.getByLabelText("Kategoria")).toHaveValue("")
        expect(screen.getByLabelText("Kroki do odtworzenia")).toHaveValue("")
    })

    it("clears the form on the manual reset button", async () => {
        const user = userEvent.setup()
        render(<TicketForm/>)

        await user.type(screen.getByLabelText("Tytuł"), "Coś tam")
        await user.click(screen.getByRole("button", {name: "Wyczyść"}))

        expect(screen.getByLabelText("Tytuł")).toHaveValue("")
    })

    it("clears validation errors on reset", async () => {
        // reset czyści nie tylko wartości, ale też errors i touchedFields
        const user = userEvent.setup()
        render(<TicketForm/>)

        await user.click(screen.getByRole("button", {name: "Utwórz"}))
        await screen.findByText("Wybierz kategorię")

        await user.click(screen.getByRole("button", {name: "Wyczyść"}))

        expect(screen.queryByText("Wybierz kategorię")).not.toBeInTheDocument()
    })

    it("does NOT clear the form when the submit fails", async () => {
        // user nie może stracić tego, co wpisał
        mockCreate.mockRejectedValue(new Error("Serwer niedostępny"))

        const user = userEvent.setup()
        render(<TicketForm/>)
        await fillValidBug(user)

        await user.click(screen.getByRole("button", {name: "Utwórz"}))

        await screen.findByRole("alert")
        expect(screen.getByLabelText("Tytuł")).toHaveValue("Przycisk nie działa")
    })
})


describe("TicketForm — setError", () => {

    beforeEach(() => vi.clearAllMocks())

    it("shows a server field error NEXT TO the field", async () => {
        // TO JEST SEDNO setError — komunikat ląduje przy inpucie,
        // a nie w ogólnym banerze
        mockCreate.mockRejectedValue(
            new FieldError("title", "Zgłoszenie o takim tytule już istnieje")
        )

        const user = userEvent.setup()
        render(<TicketForm/>)
        await fillValidBug(user)

        await user.click(screen.getByRole("button", {name: "Utwórz"}))

        expect(await screen.findByText("Zgłoszenie o takim tytule już istnieje"))
            .toBeInTheDocument()
        // pole oznaczone jako niepoprawne
        expect(screen.getByLabelText("Tytuł")).toHaveAttribute("aria-invalid", "true")
    })

    it("focuses the field with the server error", async () => {
        // shouldFocus: true — kursor skacze na pole do poprawy
        mockCreate.mockRejectedValue(new FieldError("title", "Duplikat"))

        const user = userEvent.setup()
        render(<TicketForm/>)
        await fillValidBug(user)

        await user.click(screen.getByRole("button", {name: "Utwórz"}))

        await screen.findByText("Duplikat")
        expect(screen.getByLabelText("Tytuł")).toHaveFocus()
    })

    it("clears the server error when the user edits the field", async () => {
        mockCreate.mockRejectedValue(new FieldError("title", "Duplikat"))

        const user = userEvent.setup()
        render(<TicketForm/>)
        await fillValidBug(user)
        await user.click(screen.getByRole("button", {name: "Utwórz"}))
        await screen.findByText("Duplikat")

        await user.type(screen.getByLabelText("Tytuł"), "x")

        expect(screen.queryByText("Duplikat")).not.toBeInTheDocument()
    })

    it("shows a generic error in the banner, not on a field", async () => {
        mockCreate.mockRejectedValue(new Error("Serwer niedostępny"))

        const user = userEvent.setup()
        render(<TicketForm/>)
        await fillValidBug(user)

        await user.click(screen.getByRole("button", {name: "Utwórz"}))

        expect(await screen.findByRole("alert")).toHaveTextContent("Serwer niedostępny")
        expect(screen.getByLabelText("Tytuł")).not.toHaveAttribute("aria-invalid", "true")
    })
})
