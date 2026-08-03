import {describe, it, expect} from "vitest"
import {render, screen, fireEvent} from "@testing-library/react"
import {SimpleVirtualList} from "./SimpleVirtualList"
import {generateItems} from "./data"

// ============================================================================
// TESTY WIRTUALIZACJI — co da się sensownie sprawdzić w jsdom.
//
// UWAGA: jsdom nie ma layoutu. Nie ma realnych wysokości, offsetHeight = 0,
// scroll nie działa "naprawdę". Da się jednak testować LOGIKĘ:
// ile elementów trafia do DOM i jak reaguje na zmianę scrollTop.
//
// Testowanie płynności scrollowania czy realnych pozycji pikselowych
// należy do E2E (Playwright), nie do testów jednostkowych.
// ============================================================================

describe("generateItems", () => {

    it("generates the requested number of items", () => {
        expect(generateItems(100)).toHaveLength(100)
    })

    it("gives each item a unique id", () => {
        const items = generateItems(50)
        const ids = new Set(items.map(i => i.id))

        expect(ids.size).toBe(50)
    })

    it("returns an empty array for 0", () => {
        expect(generateItems(0)).toEqual([])
    })
})


describe("SimpleVirtualList", () => {

    it("renders only a small window of rows, not all 10 000", () => {
        // TO JEST SEDNO WIRTUALIZACJI — w DOM ma być garstka wierszy
        render(<SimpleVirtualList/>)

        const rows = screen.getAllByText(/^Item \d+$/)

        expect(rows.length).toBeGreaterThan(0)
        expect(rows.length).toBeLessThan(50)   // 400/40 + 2*5 overscan = ~20
    })

    it("renders the first rows at scroll position 0", () => {
        render(<SimpleVirtualList/>)

        expect(screen.getByText("Item 0")).toBeInTheDocument()
        // element daleko poza widokiem NIE istnieje w DOM
        expect(screen.queryByText("Item 5000")).not.toBeInTheDocument()
    })

    it("swaps the rendered window when scrolled", () => {
        render(<SimpleVirtualList/>)

        const container = screen.getByTestId("scroll-container")

        // 200 wierszy * 40px = offset 8000px
        fireEvent.scroll(container, {target: {scrollTop: 8000}})

        // stare wiersze zniknęły, nowe się pojawiły
        expect(screen.queryByText("Item 0")).not.toBeInTheDocument()
        expect(screen.getByText("Item 200")).toBeInTheDocument()
    })

    it("keeps the DOM window small after scrolling", () => {
        render(<SimpleVirtualList/>)

        const container = screen.getByTestId("scroll-container")
        fireEvent.scroll(container, {target: {scrollTop: 8000}})

        const rows = screen.getAllByText(/^Item \d+$/)

        expect(rows.length).toBeLessThan(50)   // nie akumuluje wierszy
    })

    it("shows the total count in the summary", () => {
        render(<SimpleVirtualList/>)

        expect(screen.getByText(/10000 wierszy w danych/)).toBeInTheDocument()
    })

    it("does not go below index 0 when scrolled to the very top", () => {
        // WARTOŚĆ GRANICZNA — bez Math.max(0, ...) overscan zszedłby poniżej zera
        render(<SimpleVirtualList/>)

        const container = screen.getByTestId("scroll-container")
        fireEvent.scroll(container, {target: {scrollTop: 0}})

        expect(screen.getByText("Item 0")).toBeInTheDocument()
    })

    it("does not overflow past the last item when scrolled to the bottom", () => {
        // WARTOŚĆ GRANICZNA — bez Math.min(items.length, ...) slice wyszedłby poza tablicę
        render(<SimpleVirtualList/>)

        const container = screen.getByTestId("scroll-container")
        // 10 000 * 40 = 400 000, minus wysokość kontenera
        fireEvent.scroll(container, {target: {scrollTop: 399_600}})

        expect(screen.getByText("Item 9999")).toBeInTheDocument()
        // nie ma "Item 10000" — nie wyszliśmy poza tablicę
        expect(screen.queryByText("Item 10000")).not.toBeInTheDocument()
    })
})
