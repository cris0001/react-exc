import {describe, it, expect, vi, beforeEach, afterEach} from "vitest"
import {renderHook, act} from "@testing-library/react"
import {useDebounce} from "./useDebounce"

// ============================================================
// TESTY HOOKA Z TIMEREM.
// Bez fake timers musielibyśmy realnie czekać 500ms na każdy test.
// vi.useFakeTimers() pozwala "przewijać" czas ręcznie.
// ============================================================

describe("useDebounce", () => {

    beforeEach(() => {
        vi.useFakeTimers()   // podmieniamy setTimeout na kontrolowany
    })

    afterEach(() => {
        vi.useRealTimers()   // sprzątamy — inne testy mają mieć prawdziwy czas
    })

    it("returns the initial value immediately", () => {
        const {result} = renderHook(() => useDebounce("a", 500))

        expect(result.current).toBe("a")   // pierwsza wartość bez opóźnienia
    })

    it("does not update before the delay passes", () => {
        // rerender pozwala zmienić propsy hooka (jak zmiana value w komponencie)
        const {result, rerender} = renderHook(
            ({value}) => useDebounce(value, 500),
            {initialProps: {value: "a"}}
        )

        rerender({value: "b"})   // value się zmienia

        // przed upływem 500ms debounced wciąż trzyma starą wartość
        act(() => {
            vi.advanceTimersByTime(499)
        })
        expect(result.current).toBe("a")
    })

    it("updates after the delay passes", () => {
        const {result, rerender} = renderHook(
            ({value}) => useDebounce(value, 500),
            {initialProps: {value: "a"}}
        )

        rerender({value: "b"})

        act(() => {
            vi.advanceTimersByTime(500)   // dokładnie po delay
        })
        expect(result.current).toBe("b")
    })

    it("resets the timer when value changes again", () => {
        // KLUCZOWY test debounce'a — szybkie zmiany RESETUJĄ odliczanie
        const {result, rerender} = renderHook(
            ({value}) => useDebounce(value, 500),
            {initialProps: {value: "a"}}
        )

        rerender({value: "b"})
        act(() => {
            vi.advanceTimersByTime(300)   // 300ms mija...
        })

        rerender({value: "c"})            // ...ale value znów się zmienia -> reset
        act(() => {
            vi.advanceTimersByTime(300)   // kolejne 300ms (razem 600, ale timer zresetowany)
        })

        // mimo że łącznie minęło 600ms, po ostatniej zmianie dopiero 300ms
        expect(result.current).toBe("a")

        act(() => {
            vi.advanceTimersByTime(200)   // dopełniamy do 500 od ostatniej zmiany
        })
        expect(result.current).toBe("c")   // pomija "b" — liczy się tylko ostatnia
    })

    it("only applies the latest value after rapid changes", () => {
        const {result, rerender} = renderHook(
            ({value}) => useDebounce(value, 500),
            {initialProps: {value: "a"}}
        )

        // seria szybkich zmian, każda w odstępie krótszym niż delay
        rerender({value: "b"})
        act(() => vi.advanceTimersByTime(100))
        rerender({value: "c"})
        act(() => vi.advanceTimersByTime(100))
        rerender({value: "d"})

        act(() => vi.advanceTimersByTime(500))

        expect(result.current).toBe("d")   // tylko ostatnia przechodzi
    })

    it("works with non-string values", () => {
        // generyk <T> — działa dla dowolnego typu
        const {result, rerender} = renderHook(
            ({value}) => useDebounce(value, 500),
            {initialProps: {value: 0}}
        )

        rerender({value: 42})
        act(() => vi.advanceTimersByTime(500))

        expect(result.current).toBe(42)
    })
})