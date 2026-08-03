// ============================================================================
// KLOCEK 2 — setTimeout + cleanup (resetowanie timera)
// ----------------------------------------------------------------------------
// WZORZEC: ustawiasz timer, cleanup go kasuje przy KAŻDEJ zmianie deps.
//          To cleanup daje efekt "czekania".
// UWAGA: setTimeout -> clearTimeout (NIE clearInterval!)
//
//   useEffect(() => {
//     const timer = setTimeout(() => {...}, ms)
//     return () => clearTimeout(timer)
//   }, [value, ms])
//
// HOOKI TU: useDebounce (Tier 1), useThrottle (Tier 2), useTimeout
// ============================================================================

import {useEffect, useRef, useState} from "react"

// --- useDebounce [Tier 1] --------------------------------------------------
export function useDebounce<T>(value: T, ms: number): T {
    const [debounced, setDebounced] = useState(value)

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), ms)
        // każda zmiana value/ms kasuje stary timer -> odliczanie od nowa
        return () => clearTimeout(timer)
    }, [value, ms]) // deps: value ORAZ ms (nie samo value)

    return debounced
}

// użycie: const q = useDebounce(query, 500) — zmieni się 500ms po ostatnim znaku

// --- useThrottle (timestamp w refie, patrz KLOCEK 3) [Tier 2] --------------
export function useThrottle<T>(value: T, ms: number): T {
    const [throttled, setThrottled] = useState(value)
    const lastRun = useRef<number>(Date.now()) // czas ostatniego przepuszczenia

    useEffect(() => {
        const remaining = ms - (Date.now() - lastRun.current)
        if (remaining <= 0) {
            // okno minęło -> przepuść od razu
            setThrottled(value)
            lastRun.current = Date.now()
        } else {
            // wciąż w oknie -> zaplanuj na resztę okna
            const timer = setTimeout(() => {
                setThrottled(value)
                lastRun.current = Date.now()
            }, remaining)
            return () => clearTimeout(timer) // cleanup TYLKO w else (timer istnieje tu)
        }
    }, [value, ms])

    return throttled
}

// debounce vs throttle: debounce czeka na ciszę, throttle odpala regularnie

// --- useTimeout (callback po delay; latest ref = KLOCEK 3) -----------------
export function useTimeout(callback: () => void, delay: number | null) {
    const savedCallback = useRef(callback)
    useEffect(() => {
        savedCallback.current = callback
    }, [callback])

    useEffect(() => {
        if (delay === null) return // null = wyłączony
        const id = setTimeout(() => savedCallback.current(), delay)
        return () => clearTimeout(id)
    }, [delay])
}