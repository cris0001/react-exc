import {describe, it, expect, vi} from "vitest"
import {render, screen} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {useState} from "react"
import {Modal} from "./Modal"

// ============================================================================
// TESTY MODALA — głównie o FOCUSIE, bo to jest ta część, którą najłatwiej
// zepsuć i najtrudniej zauważyć myszą.
//
// document.activeElement to element, który ma aktualnie focus.
// toHaveFocus() z jest-dom sprawdza dokładnie to.
// ============================================================================

function TestHarness() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div>
            <button onClick={() => setIsOpen(true)}>Otwórz</button>
            <button>Przycisk w tle</button>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Tytuł">
                <input aria-label="Pole" />
                <button>Anuluj</button>
                <button>Potwierdź</button>
            </Modal>
        </div>
    )
}


describe("Modal — renderowanie", () => {

    it("renders nothing when closed", () => {
        render(
            <Modal isOpen={false} onClose={vi.fn()} title="Tytuł">
                <p>Treść</p>
            </Modal>
        )

        expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    })

    it("renders a dialog when open", () => {
        render(
            <Modal isOpen onClose={vi.fn()} title="Tytuł">
                <p>Treść</p>
            </Modal>
        )

        expect(screen.getByRole("dialog")).toBeInTheDocument()
        expect(screen.getByText("Treść")).toBeInTheDocument()
    })

    it("marks itself as modal and labels itself with the title", () => {
        render(
            <Modal isOpen onClose={vi.fn()} title="Potwierdzenie">
                <p>Treść</p>
            </Modal>
        )

        const dialog = screen.getByRole("dialog")

        expect(dialog).toHaveAttribute("aria-modal", "true")
        // aria-labelledby wskazuje na nagłówek -> czytnik ogłosi tytuł
        const labelId = dialog.getAttribute("aria-labelledby")
        expect(document.getElementById(labelId!)).toHaveTextContent("Potwierdzenie")
    })

    it("locks background scroll while open", () => {
        const {unmount} = render(
            <Modal isOpen onClose={vi.fn()} title="Tytuł">
                <p>Treść</p>
            </Modal>
        )

        expect(document.body.style.overflow).toBe("hidden")

        unmount()
        expect(document.body.style.overflow).not.toBe("hidden")
    })
})


describe("Modal — zamykanie", () => {

    it("closes on Escape", async () => {
        const onClose = vi.fn()
        const user = userEvent.setup()

        render(
            <Modal isOpen onClose={onClose} title="Tytuł">
                <p>Treść</p>
            </Modal>
        )

        await user.keyboard("{Escape}")

        expect(onClose).toHaveBeenCalled()
    })

    it("closes on the close button", async () => {
        const onClose = vi.fn()
        const user = userEvent.setup()

        render(
            <Modal isOpen onClose={onClose} title="Tytuł">
                <p>Treść</p>
            </Modal>
        )

        await user.click(screen.getByRole("button", {name: "Zamknij"}))

        expect(onClose).toHaveBeenCalled()
    })

    it("does not close when clicking inside the dialog", async () => {
        // zdarzenie bąbelkuje do overlaya — bez warunku
        // e.target === e.currentTarget modal zamykałby się od kliknięcia w treść
        const onClose = vi.fn()
        const user = userEvent.setup()

        render(
            <Modal isOpen onClose={onClose} title="Tytuł">
                <p>Treść</p>
            </Modal>
        )

        await user.click(screen.getByText("Treść"))

        expect(onClose).not.toHaveBeenCalled()
    })
})


describe("Modal — focus trap", () => {

    it("moves focus into the dialog when it opens", async () => {
        const user = userEvent.setup()
        render(<TestHarness/>)

        await user.click(screen.getByRole("button", {name: "Otwórz"}))

        // pierwszy focusowalny element w środku
        expect(screen.getByLabelText("Pole")).toHaveFocus()
    })

    it("wraps focus from the last element back to the first", async () => {
        const user = userEvent.setup()
        render(<TestHarness/>)

        await user.click(screen.getByRole("button", {name: "Otwórz"}))

        // Pole -> Anuluj -> Potwierdź -> Zamknij (ostatni) -> zawinięcie
        await user.tab()   // Anuluj
        await user.tab()   // Potwierdź
        await user.tab()   // Zamknij
        await user.tab()   // zawija na Pole

        expect(screen.getByLabelText("Pole")).toHaveFocus()
    })

    it("wraps focus backwards from the first element to the last", async () => {
        const user = userEvent.setup()
        render(<TestHarness/>)

        await user.click(screen.getByRole("button", {name: "Otwórz"}))

        await user.tab({shift: true})

        expect(screen.getByRole("button", {name: "Zamknij"})).toHaveFocus()
    })

    it("never lets focus reach the background", async () => {
        // TO JEST SEDNO PUŁAPKI NA FOCUS
        const user = userEvent.setup()
        render(<TestHarness/>)

        await user.click(screen.getByRole("button", {name: "Otwórz"}))

        // kilka razy Tab dookoła
        for (let i = 0; i < 8; i++) {
            await user.tab()
        }

        expect(screen.getByRole("button", {name: "Przycisk w tle"})).not.toHaveFocus()
        expect(screen.getByRole("dialog")).toContainElement(
            document.activeElement as HTMLElement
        )
    })

    it("returns focus to the trigger after closing", async () => {
        // najczęściej pomijana część — bez tego user klawiatury
        // ląduje na początku strony
        const user = userEvent.setup()
        render(<TestHarness/>)

        const trigger = screen.getByRole("button", {name: "Otwórz"})
        await user.click(trigger)

        await user.keyboard("{Escape}")

        expect(trigger).toHaveFocus()
    })
})
