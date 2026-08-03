// ============================================================================
// KLOCEK 4 — async w useEffect + AbortController (race condition)
// ----------------------------------------------------------------------------
// WZORZEC:
//   - async funkcja W ŚRODKU efektu (callback useEffect NIE może być async)
//   - AbortController + signal w fetch + abort() w cleanupie
//   - fetch NIE rzuca na 404/500 -> sprawdzaj res.ok i throw sam
//   - w catch ignoruj AbortError (anulowanie to nie błąd)
//
// RACE CONDITION: stary request wraca PO nowym i nadpisuje dane.
//                 abort() w cleanupie to rozwiązuje.
//
// HOOKI TU: useFetch (Tier 1)
// ============================================================================

import {useEffect, useState} from "react"

// --- useFetch (pełny, z abortem) [Tier 1] ----------------------------------
export function useFetch<T>(url: string) {
    const [data, setData] = useState<T | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const controller = new AbortController()

        const fetchData = async () => {
            try {
                setLoading(true)
                setError(null)
                const res = await fetch(url, {signal: controller.signal})
                if (!res.ok) throw new Error(`HTTP ${res.status}`) // fetch nie rzuca sam
                const json = await res.json()
                setData(json)
            } catch (err) {
                // anulowanie -> to nie błąd, wychodzimy
                if (err instanceof Error && err.name === "AbortError") return
                setError(err instanceof Error ? err.message : "Coś poszło nie tak")
            } finally {
                // nie ruszaj loading po abort (uniknij race na loading)
                if (!controller.signal.aborted) setLoading(false)
            }
        }

        fetchData()
        return () => controller.abort() // cleanup anuluje stary request
    }, [url])

    return {data, loading, error}
    // W PRODUKCJI: React Query / SWR (cache, retry, dedup). To ćwiczenie na wzorzec.
}