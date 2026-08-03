// ============================================================================
// KLOCEK 3 — ref jako cichy schowek (+ "latest ref")
// ----------------------------------------------------------------------------
// WZORZEC: ref trzyma coś między renderami BEZ re-renderu.
//   a) PAMIĘĆ: poprzednia wartość, timestamp, flaga mounted
//   b) LATEST REF: świeży callback, żeby efekt się nie przepinał
//
// REF vs STATE:
//   - state -> zmiana WYWOŁUJE re-render (widoczne w UI)
//   - ref   -> zmiana NIE wywołuje re-renderu (cichy schowek)
//   Gdyby usePrevious używał state -> zapis -> re-render -> pętla.
//
// HOOKI TU: usePrevious (Tier 1), useInterval (Tier 2), useIsMounted
// ============================================================================

import {useEffect, useRef, useCallback} from "react"

// --- usePrevious (schowek + zapis PO renderze) [Tier 1] --------------------
export function usePrevious<T>(value: T): T | undefined {
    const ref = useRef<T | undefined>(undefined)

    useEffect(() => {
        ref.current = value // zapis PO renderze (useEffect leci po paincie)
    }, [value])

    // zwracamy PRZED nadpisaniem w tym renderze -> to jest wartość poprzednia
    return ref.current
}

// --- useInterval (klasyk Dana Abramova, latest ref) [Tier 2] ---------------
export function useInterval(callback: () => void, delay: number | null) {
    const savedCallback = useRef(callback)
    useEffect(() => {
        savedCallback.current = callback
    }, [callback])

    useEffect(() => {
        if (delay === null) return // null = pauza
        // wołamy z refa -> zawsze ŚWIEŻY callback, interval się nie restartuje
        const id = setInterval(() => savedCallback.current(), delay)
        return () => clearInterval(id)
    }, [delay])
    // PUŁAPKA: naiwne setInterval(callback, delay) łapie stale closure
    //          (callback widzi stary state). Latest ref to naprawia.
}

// --- useIsMounted (flaga w refie) ------------------------------------------
export function useIsMounted() {
    const isMounted = useRef(false)
    useEffect(() => {
        isMounted.current = true
        return () => {
            isMounted.current = false
        }
    }, [])
    // zwracamy FUNKCJĘ (nie wartość) -> odczyt aktualny w momencie wywołania
    return useCallback(() => isMounted.current, [])
}

// użycie: const isMounted = useIsMounted(); if (isMounted()) setData(...)