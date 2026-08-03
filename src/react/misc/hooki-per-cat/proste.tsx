// ============================================================================
// POZA KLOCKAMI — proste, ale ważne (Tier 1)
// ----------------------------------------------------------------------------
// Nie mieszczą się w jednym z 5 klocków, ale padają często.
// WZORCE: funkcyjny updater (useToggle), lazy init + synchronizacja (useLocalStorage)
//
// HOOKI TU: useToggle (Tier 1), useLocalStorage (Tier 1)
// ============================================================================

import {useEffect, useState, useCallback} from "react"

// --- useToggle (funkcyjny updater — unika stale closure) [Tier 1] ----------
export function useToggle(initial: boolean) {
    const [value, setValue] = useState(initial)
    // setValue(prev => !prev) -> zawsze świeża wartość, dlatego useCallback([]) OK
    // setValue(!value) z [] byłoby stale closure (widziałoby stary value)
    const toggle = useCallback(() => setValue((prev) => !prev), [])
    return [value, toggle] as const
}

// bonus: toggle z opcjonalną wartością
// const toggle = useCallback((val?: boolean) =>
//   setValue(prev => val ?? !prev), [])

// --- useLocalStorage (generyk + lazy init + synchronizacja) [Tier 1] -------
export function useLocalStorage<T>(key: string, initialValue: T): [T, (v: T) => void] {
    // lazy init: funkcja () => ... czyta z localStorage TYLKO raz (na mount)
    const [value, setValue] = useState<T>(() => {
        if (typeof window === "undefined") return initialValue // SSR
        try {
            const item = window.localStorage.getItem(key)
            return item ? (JSON.parse(item) as T) : initialValue
        } catch {
            return initialValue // zepsuty JSON -> fallback
        }
    })

    // synchronizacja: KAŻDA zmiana value -> zapis (nie ma dziury jak w wrapped setter)
    useEffect(() => {
        window.localStorage.setItem(key, JSON.stringify(value))
    }, [value, key])

    return [value, setValue]
}