import {describe, it, expect, vi} from "vitest"
import {render, screen} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {Combobox} from "./Combobox"

// ============================================================================
// TESTY NAWIGACJI KLAWIATURĄ.
//
// ZALETA POPRAWNEGO ARIA: wszystko jest testowalne przez ROLE i ATRYBUTY,
// a nie przez klasy CSS. Podświetlenie sprawdzamy przez aria-selected
// i aria-activedescendant — czyli dokładnie to, co "widzi" czytnik ekranu.
// Gdyby stan siedział tylko w className, test byłby sprzężony ze stylami.
// ============================================================================

const OPTIONS = ["Jabłko", "Banan", "Czereśnia", "Daktyl"]

function setup(value = "") {
    const onChange = vi.fn()
    const user = userEvent.setup()

    render(
        <Combobox label="Owoc" options={OPTIONS} value={value} onChange={onChange}/>
    )

    return {user, onChange, input: screen.getByRole("combobox")}
}

// helper — która opcja jest aktualnie aktywna (po aria-activedescendant)
function activeOptionText() {
    const input = screen.getByRole("combobox")
    const activeId = input.getAttribute("aria-activedescendant")

    if (!activeId) return null
    return document.getElementById(activeId)?.textContent ?? null
}


describe("Combobox — ARIA", () => {

    it("exposes the combobox role and collapsed state", () => {
        const {input} = setup()

        expect(input).toHaveAttribute("aria-expanded", "false")
        expect(input).toHaveAttribute("aria-autocomplete", "list")
    })

    it("marks itself expanded when the list opens", async () => {
        const {user, input} = setup()

        await user.type(input, "a")

        expect(input).toHaveAttribute("aria-expanded", "true")
        expect(screen.getByRole("listbox")).toBeInTheDocument()
    })

    it("links the input to the listbox with aria-controls", async () => {
        const {user, input} = setup()
        await user.type(input, "a")

        expect(input.getAttribute("aria-controls"))
            .toBe(screen.getByRole("listbox").id)
    })

    it("renders each option with the option role", async () => {
        const {user, input} = setup()
        await user.type(input, "a")

        expect(screen.getAllByRole("option").length).toBeGreaterThan(0)
    })

    it("has no active descendant before any arrow key", async () => {
        const {user, input} = setup()
        await user.type(input, "a")

        expect(input).not.toHaveAttribute("aria-activedescendant")
    })
})


describe("Combobox — filtrowanie", () => {

    it("filters options as the user types", async () => {
        const {user, input} = setup()

        await user.type(input, "an")

        const options = screen.getAllByRole("option").map(o => o.textContent)
        expect(options).toEqual(["Banan"])
    })

    it("is case-insensitive", async () => {
        const {user, input} = setup()

        await user.type(input, "JAB")

        expect(screen.getAllByRole("option")).toHaveLength(1)
    })

    it("shows a message when nothing matches", async () => {
        const {user, input} = setup()

        await user.type(input, "zzz")

        expect(screen.getByText("Brak wyników")).toBeInTheDocument()
        // komunikat NIE jest opcją — czytnik nie ogłosi go jako wybieralnego
        expect(screen.queryAllByRole("option")).toHaveLength(0)
    })
})


describe("Combobox — nawigacja klawiaturą", () => {

    it("opens and highlights the first option on ArrowDown", async () => {
        const {user, input} = setup()

        await user.click(input)
        await user.keyboard("{ArrowDown}")

        expect(input).toHaveAttribute("aria-expanded", "true")
        expect(activeOptionText()).toBe("Jabłko")
    })

    it("moves the highlight down", async () => {
        const {user, input} = setup()
        await user.click(input)

        await user.keyboard("{ArrowDown}{ArrowDown}")

        expect(activeOptionText()).toBe("Banan")
    })

    it("moves the highlight up", async () => {
        const {user, input} = setup()
        await user.click(input)

        await user.keyboard("{ArrowDown}{ArrowDown}{ArrowDown}{ArrowUp}")

        expect(activeOptionText()).toBe("Banan")
    })

    it("wraps from the last option to the first", async () => {
        // WARTOŚĆ GRANICZNA — tu żyje bug z modulo
        const {user, input} = setup()
        await user.click(input)

        // 4 opcje: schodzimy na ostatnią, jeszcze raz w dół = zawinięcie
        await user.keyboard("{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}")

        expect(activeOptionText()).toBe("Jabłko")
    })

    it("wraps from the first option to the last", async () => {
        // WARTOŚĆ GRANICZNA — (prev - 1 + len) % len, nie (prev - 1) % len
        const {user, input} = setup()
        await user.click(input)

        await user.keyboard("{ArrowUp}")

        expect(activeOptionText()).toBe("Daktyl")
    })

    it("jumps to the first option with Home", async () => {
        const {user, input} = setup()
        await user.click(input)

        await user.keyboard("{ArrowDown}{ArrowDown}{ArrowDown}{Home}")

        expect(activeOptionText()).toBe("Jabłko")
    })

    it("jumps to the last option with End", async () => {
        const {user, input} = setup()
        await user.click(input)

        await user.keyboard("{ArrowDown}{End}")

        expect(activeOptionText()).toBe("Daktyl")
    })

    it("marks only the active option as selected", async () => {
        const {user, input} = setup()
        await user.click(input)
        await user.keyboard("{ArrowDown}{ArrowDown}")

        const options = screen.getAllByRole("option")
        const selected = options.filter(o => o.getAttribute("aria-selected") === "true")

        expect(selected).toHaveLength(1)
        expect(selected[0]).toHaveTextContent("Banan")
    })
})


describe("Combobox — wybór", () => {

    it("selects the highlighted option with Enter", async () => {
        const {user, onChange, input} = setup()
        await user.click(input)

        await user.keyboard("{ArrowDown}{ArrowDown}{Enter}")

        expect(onChange).toHaveBeenCalledWith("Banan")
        expect(input).toHaveValue("Banan")
        expect(screen.queryByRole("listbox")).not.toBeInTheDocument()
    })

    it("does nothing on Enter when nothing is highlighted", async () => {
        // bez tego warunku Enter "wybierałby" losową opcję
        const {user, onChange, input} = setup()

        await user.type(input, "a")
        await user.keyboard("{Enter}")

        expect(onChange).not.toHaveBeenCalled()
    })

    it("selects on click", async () => {
        const {user, onChange, input} = setup()
        await user.type(input, "an")

        await user.click(screen.getByRole("option", {name: "Banan"}))

        expect(onChange).toHaveBeenCalledWith("Banan")
    })

    it("syncs the highlight with the mouse", async () => {
        // mysz i klawiatura nie mogą się "kłócić" o podświetlenie
        const {user, input} = setup()
        await user.type(input, "a")

        await user.hover(screen.getByRole("option", {name: "Banan"}))

        expect(activeOptionText()).toBe("Banan")
    })
})


describe("Combobox — Escape", () => {

    it("closes the list on the first Escape", async () => {
        const {user, input} = setup()
        await user.type(input, "a")

        await user.keyboard("{Escape}")

        expect(screen.queryByRole("listbox")).not.toBeInTheDocument()
        expect(input).toHaveValue("a")   // tekst zostaje
    })

    it("clears the input on the second Escape", async () => {
        // dwupoziomowy Escape zgodny z APG
        const {user, onChange, input} = setup()
        await user.type(input, "a")

        await user.keyboard("{Escape}{Escape}")

        expect(input).toHaveValue("")
        expect(onChange).toHaveBeenCalledWith("")
    })
})
