import {describe, it, expect, vi, beforeEach} from "vitest"
import {renderHook, act, waitFor} from "@testing-library/react"
import {useInfinitePosts, type Post} from "./useInfinitePosts"

// ============================================================================
// TESTY HOOKA AKUMULUJĄCEGO STRONY.
// Tu testujemy MECHANIKĘ: doklejanie, wykrywanie końca, blokadę duplikatów.
// IntersectionObserver nie jest tu w ogóle potrzebny — to zaleta podziału
// na dwa hooki.
// ============================================================================

function makePosts(startId: number, count: number): Post[] {
    return Array.from({length: count}, (_, i) => ({
        id: startId + i,
        title: `Post ${startId + i}`,
        body: "treść",
        userId: 1,
    }))
}

function okResponse(body: unknown) {
    return {ok: true, json: async () => body} as Response
}


describe("useInfinitePosts", () => {

    beforeEach(() => {
        globalThis.fetch = vi.fn()
    })

    it("loads the first page on mount", async () => {
        vi.mocked(fetch).mockResolvedValueOnce(okResponse(makePosts(1, 10)))

        const {result} = renderHook(() => useInfinitePosts())

        await waitFor(() => expect(result.current.posts).toHaveLength(10))
        expect(result.current.loading).toBe(false)
        expect(result.current.hasMore).toBe(true)
    })

    it("requests page 1 with the right params", async () => {
        vi.mocked(fetch).mockResolvedValueOnce(okResponse(makePosts(1, 10)))

        renderHook(() => useInfinitePosts())

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                expect.stringContaining("_page=1"),
                expect.anything(),
            )
        })
    })

    // ---------- AKUMULACJA ----------
    it("appends the next page instead of replacing", async () => {
        // TO JEST SEDNO INFINITE SCROLLA
        vi.mocked(fetch)
            .mockResolvedValueOnce(okResponse(makePosts(1, 10)))
            .mockResolvedValueOnce(okResponse(makePosts(11, 10)))

        const {result} = renderHook(() => useInfinitePosts())

        await waitFor(() => expect(result.current.posts).toHaveLength(10))

        act(() => result.current.loadMore())

        await waitFor(() => expect(result.current.posts).toHaveLength(20))
        // stare pozycje NADAL są na liście
        expect(result.current.posts[0].id).toBe(1)
        expect(result.current.posts[19].id).toBe(20)
    })

    it("requests the next page number on loadMore", async () => {
        vi.mocked(fetch)
            .mockResolvedValueOnce(okResponse(makePosts(1, 10)))
            .mockResolvedValueOnce(okResponse(makePosts(11, 10)))

        const {result} = renderHook(() => useInfinitePosts())
        await waitFor(() => expect(result.current.posts).toHaveLength(10))

        act(() => result.current.loadMore())

        await waitFor(() => {
            expect(fetch).toHaveBeenLastCalledWith(
                expect.stringContaining("_page=2"),
                expect.anything(),
            )
        })
    })

    it("does not add duplicates if the same page arrives twice", async () => {
        // zabezpieczenie na StrictMode i wyścigi
        vi.mocked(fetch)
            .mockResolvedValueOnce(okResponse(makePosts(1, 10)))
            .mockResolvedValueOnce(okResponse(makePosts(1, 10)))   // te same id

        const {result} = renderHook(() => useInfinitePosts())
        await waitFor(() => expect(result.current.posts).toHaveLength(10))

        act(() => result.current.loadMore())

        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2))
        expect(result.current.posts).toHaveLength(10)   // bez duplikatów
    })

    // ---------- KONIEC DANYCH ----------
    it("sets hasMore to false when a partial page comes back", async () => {
        // mniej niż PAGE_SIZE = to była ostatnia strona
        vi.mocked(fetch).mockResolvedValueOnce(okResponse(makePosts(1, 3)))

        const {result} = renderHook(() => useInfinitePosts())

        await waitFor(() => expect(result.current.hasMore).toBe(false))
        expect(result.current.posts).toHaveLength(3)
    })

    it("sets hasMore to false on an empty page", () => {
        vi.mocked(fetch).mockResolvedValueOnce(okResponse([]))

        const {result} = renderHook(() => useInfinitePosts())

        return waitFor(() => expect(result.current.hasMore).toBe(false))
    })

    it("keeps hasMore true for a full page", async () => {
        // WARTOŚĆ GRANICZNA — dokładnie PAGE_SIZE oznacza "może być więcej"
        vi.mocked(fetch).mockResolvedValueOnce(okResponse(makePosts(1, 10)))

        const {result} = renderHook(() => useInfinitePosts())

        await waitFor(() => expect(result.current.posts).toHaveLength(10))
        expect(result.current.hasMore).toBe(true)
    })

    // ---------- BLOKADA PODWÓJNEGO POBRANIA ----------
    it("ignores a second loadMore while one is in flight", async () => {
        // KLUCZOWY TEST — bez refa jako blokady poleciałyby dwa requesty
        let resolveSecond: (v: Response) => void
        const pending = new Promise<Response>((r) => {
            resolveSecond = r
        })

        vi.mocked(fetch)
            .mockResolvedValueOnce(okResponse(makePosts(1, 10)))
            .mockReturnValueOnce(pending)          // druga strona wisi

        const {result} = renderHook(() => useInfinitePosts())
        await waitFor(() => expect(result.current.posts).toHaveLength(10))

        act(() => result.current.loadMore())       // startuje pobranie
        act(() => result.current.loadMore())       // powinno zostać ZIGNOROWANE
        act(() => result.current.loadMore())

        expect(fetch).toHaveBeenCalledTimes(2)     // 1 (mount) + 1, nie 4

        resolveSecond!(okResponse(makePosts(11, 10)))
        await waitFor(() => expect(result.current.posts).toHaveLength(20))
    })

    // ---------- BŁĘDY ----------
    it("sets an error on a failed request", async () => {
        vi.mocked(fetch).mockResolvedValueOnce({ok: false, status: 500} as Response)

        const {result} = renderHook(() => useInfinitePosts())

        await waitFor(() => expect(result.current.error).toBe("HTTP 500"))
    })

    it("keeps already loaded posts when a later page fails", async () => {
        // user nie może stracić tego, co już widzi
        vi.mocked(fetch)
            .mockResolvedValueOnce(okResponse(makePosts(1, 10)))
            .mockResolvedValueOnce({ok: false, status: 500} as Response)

        const {result} = renderHook(() => useInfinitePosts())
        await waitFor(() => expect(result.current.posts).toHaveLength(10))

        act(() => result.current.loadMore())

        await waitFor(() => expect(result.current.error).toBe("HTTP 500"))
        expect(result.current.posts).toHaveLength(10)   // stare dane zostają
    })

    it("retries the failed page", async () => {
        vi.mocked(fetch)
            .mockResolvedValueOnce(okResponse(makePosts(1, 10)))
            .mockResolvedValueOnce({ok: false, status: 500} as Response)
            .mockResolvedValueOnce(okResponse(makePosts(11, 10)))

        const {result} = renderHook(() => useInfinitePosts())
        await waitFor(() => expect(result.current.posts).toHaveLength(10))

        act(() => result.current.loadMore())
        await waitFor(() => expect(result.current.error).toBe("HTTP 500"))

        act(() => result.current.retry())

        await waitFor(() => expect(result.current.posts).toHaveLength(20))
        expect(result.current.error).toBe("")
    })
})
