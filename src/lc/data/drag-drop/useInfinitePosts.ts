'use client'

import {useCallback, useEffect, useRef, useState} from "react"

export type Post = {
    id: number
    title: string
    body: string
    userId: number
}

const PAGE_SIZE = 10

// ============================================================================
// HOOK AKUMULUJĄCY STRONY.
// Różnica wobec zwykłego useFetch: nie PODMIENIA danych, tylko je DOKŁADA.
// ============================================================================

export function useInfinitePosts() {
    const [posts, setPosts] = useState<Post[]>([])
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [hasMore, setHasMore] = useState(true)

    // BLOKADA PRZED PODWÓJNYM POBRANIEM — w REFIE, nie w stanie.
    //
    // Dlaczego nie `if (loading) return`? Bo setState jest ODROCZONY:
    // między setLoading(true) a re-renderem jest okno, w którym `loading`
    // wciąż odczytuje się jako false. Przy szybkim scrollowaniu observer
    // odpaliłby drugie pobranie tej samej strony.
    // Ref mutuje się SYNCHRONICZNIE — brak okna.
    const isFetching = useRef(false)

    // ref na numer strony, żeby loadMore mogło zostać stabilne (pusta tablica
    // zależności) i nie tworzyło nowej funkcji przy każdym renderze —
    // inaczej efekt w komponencie odpalałby się w kółko.
    const pageRef = useRef(1)

    const fetchPage = useCallback(async (pageToFetch: number) => {
        if (isFetching.current) return

        isFetching.current = true
        setLoading(true)
        setError("")

        const controller = new AbortController()

        try {
            const res = await fetch(
                `https://jsonplaceholder.typicode.com/posts?_page=${pageToFetch}&_limit=${PAGE_SIZE}`,
                {signal: controller.signal}
            )

            if (!res.ok) throw new Error(`HTTP ${res.status}`)

            const data: Post[] = await res.json()

            // DOKŁADAMY, nie podmieniamy. Updater, bo nowy stan zależy od starego
            // i między wywołaniami mogło dojść do innych aktualizacji.
            setPosts((prev) => {
                // deduplikacja na wypadek, gdyby ta sama strona jednak przeszła
                // dwa razy (np. React StrictMode w dev montuje efekty podwójnie)
                const existingIds = new Set(prev.map((p) => p.id))
                const fresh = data.filter((p) => !existingIds.has(p.id))
                return [...prev, ...fresh]
            })

            // KONIEC DANYCH: API zwróciło mniej niż pełną stronę.
            // Sprawdzanie tylko `data.length === 0` też działa, ale wtedy
            // robisz jedno pobranie więcej niż trzeba.
            if (data.length < PAGE_SIZE) {
                setHasMore(false)
            } else {
                pageRef.current = pageToFetch + 1
                setPage(pageToFetch + 1)
            }
        } catch (err) {
            if (err instanceof Error && err.name === "AbortError") return
            setError(err instanceof Error ? err.message : "Coś poszło nie tak")
        } finally {
            isFetching.current = false
            setLoading(false)
        }
    }, [])

    // funkcja STABILNA (pusta tablica deps) — czyta numer strony z refa,
    // więc nie musi mieć `page` w zależnościach i nie zmienia referencji
    const loadMore = useCallback(() => {
        void fetchPage(pageRef.current)
    }, [fetchPage])

    // pierwsza strona przy montowaniu
    useEffect(() => {
        void fetchPage(1)
    }, [fetchPage])

    const retry = useCallback(() => {
        setError("")
        void fetchPage(pageRef.current)
    }, [fetchPage])

    return {posts, loading, error, hasMore, loadMore, retry, page}
}

// ----------------------------------------------------------------------------
// DLACZEGO BLOKADA MUSI BYĆ REFEM (a nie stanem)
//
//   observer widzi sentinel -> loadMore() -> setLoading(true)
//   ...ale re-render jeszcze nie nastąpił...
//   observer odpala się PONOWNIE (scroll trwa) -> if (loading) czyta STARE false
//   -> drugie pobranie tej samej strony -> duplikaty na liście
//
// Ref mutuje się natychmiast, więc drugie wywołanie widzi już `true`.
// To ta sama zasada, co blokada double-submit w formularzu.
//
// STAN vs REF — reguła:
//   napędza UI (spinner, disabled)  -> state
//   tylko logika, potrzebne od razu  -> ref
// Tutaj potrzebne oba: `loading` do spinnera, `isFetching` do blokady.
// ----------------------------------------------------------------------------
