import {describe, it, expect, vi, beforeEach} from "vitest"
import {renderHook, waitFor} from "@testing-library/react"
import {useFetch} from "./useFetch"

// ============================================================
// TESTY HOOKA useFetch (renderHook).
// Tu testujemy MECHANIKĘ fetcha w izolacji: loading, data, error,
// abort/race, keepPreviousData. Komponenty używające hooka NIE muszą
// tego powtarzać — testują tylko swoje zachowanie.
// ============================================================

// helper — udana odpowiedź
function okResponse(body: unknown) {
    return {
        ok: true,
        json: async () => body,
    } as Response
}

describe("useFetch", () => {

    beforeEach(() => {
        global.fetch = vi.fn()
    })

    // ---------- SUKCES ----------
    it("returns data on a successful fetch", async () => {
        vi.mocked(fetch).mockResolvedValueOnce(okResponse({id: 1, name: "Anna"}))

        const {result} = renderHook(() => useFetch<{ id: number; name: string }>("/api/user/1"))

        // findBy-styl: czekamy aż data się pojawi
        await waitFor(() => {
            expect(result.current.data).toEqual({id: 1, name: "Anna"})
        })
        expect(result.current.loading).toBe(false)
        expect(result.current.error).toBe("")
    })

    it("sets loading true while fetching, false after", async () => {
        vi.mocked(fetch).mockResolvedValueOnce(okResponse({ok: 1}))

        const {result} = renderHook(() => useFetch("/api/data"))

        // zaraz po starcie loading = true
        expect(result.current.loading).toBe(true)

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })
    })

    // ---------- BŁĘDY ----------
    it("sets an error on an HTTP failure (res.ok === false)", async () => {
        vi.mocked(fetch).mockResolvedValueOnce({ok: false, status: 404} as Response)

        const {result} = renderHook(() => useFetch("/api/missing"))

        await waitFor(() => {
            expect(result.current.error).toBe("Http 404")
        })
        expect(result.current.data).toBeUndefined()
    })

    it("sets an error on a network failure", async () => {
        vi.mocked(fetch).mockRejectedValueOnce(new Error("Network down"))

        const {result} = renderHook(() => useFetch("/api/data"))

        await waitFor(() => {
            expect(result.current.error).toBe("Network down")
        })
    })

    // ---------- REFETCH PRZY ZMIANIE URL ----------
    it("refetches when the url changes", async () => {
        vi.mocked(fetch)
            .mockResolvedValueOnce(okResponse({page: 1}))
            .mockResolvedValueOnce(okResponse({page: 2}))

        const {result, rerender} = renderHook(
            ({url}) => useFetch<{ page: number }>(url),
            {initialProps: {url: "/api?page=1"}}
        )

        await waitFor(() => expect(result.current.data).toEqual({page: 1}))

        rerender({url: "/api?page=2"})

        await waitFor(() => expect(result.current.data).toEqual({page: 2}))
        expect(fetch).toHaveBeenCalledTimes(2)
    })

    // ---------- RACE CONDITION (najważniejszy, hook-only) ----------
    it("ignores a stale response when the url changes mid-flight", async () => {
        // Strona 1 rozwiązuje się PÓŹNO, strona 2 SZYBKO.
        // Bez abortu późna odpowiedź strony 1 nadpisałaby stronę 2 (race).
        // Z abortem: fetch strony 1 dostaje AbortError -> ignorowany.

        let resolvePage1: (v: Response) => void
        const page1Promise = new Promise<Response>((resolve) => {
            resolvePage1 = resolve
        })


        vi.mocked(fetch)
            .mockReturnValueOnce(page1Promise)                    // strona 1: wisi
            .mockResolvedValueOnce(okResponse({page: 2}))         // strona 2: od razu

        const {result, rerender} = renderHook(
            ({url}) => useFetch<{ page: number }>(url),
            {initialProps: {url: "/api?page=1"}}
        )

        // zmiana URL zanim strona 1 się rozwiązała -> cleanup abortuje request 1
        rerender({url: "/api?page=2"})

        // strona 2 dociera
        await waitFor(() => expect(result.current.data).toEqual({page: 2}))


        // function okResponse(body: unknown) {
        //     return {
        //         ok: true,
        //         json: async () => body,
        //     } as Response
        // }


        // TERAZ spóźniona strona 1 się rozwiązuje...
        resolvePage1!(okResponse({page: 1}))

        // ...ale została zabortowana, więc NIE nadpisuje strony 2.
        // dajemy chwilę na ewentualny (błędny) setState i sprawdzamy, że nic się nie zmieniło
        await new Promise((r) => setTimeout(r, 20))
        expect(result.current.data).toEqual({page: 2})   // wciąż strona 2, nie strona 1
    })

    // ---------- keepPreviousData ----------
    it("clears data on refetch by default", async () => {
        vi.mocked(fetch)
            .mockResolvedValueOnce(okResponse({page: 1}))
            .mockResolvedValueOnce(okResponse({page: 2}))

        const {result, rerender} = renderHook(
            ({url}) => useFetch<{ page: number }>(url),   // keepPreviousData domyślnie false
            {initialProps: {url: "/api?page=1"}}
        )

        await waitFor(() => expect(result.current.data).toEqual({page: 1}))

        rerender({url: "/api?page=2"})

        // bez keepPreviousData stare dane są czyszczone na starcie refetcha
        expect(result.current.data).toBeUndefined()

        await waitFor(() => expect(result.current.data).toEqual({page: 2}))
    })

    it("keeps previous data on refetch when keepPreviousData is true", async () => {
        vi.mocked(fetch)
            .mockResolvedValueOnce(okResponse({page: 1}))
            .mockResolvedValueOnce(okResponse({page: 2}))

        const {result, rerender} = renderHook(
            ({url}) => useFetch<{ page: number }>(url, true),   // keepPreviousData = true
            {initialProps: {url: "/api?page=1"}}
        )

        await waitFor(() => expect(result.current.data).toEqual({page: 1}))

        rerender({url: "/api?page=2"})

        // stare dane NADAL są, mimo że nowy fetch trwa
        expect(result.current.data).toEqual({page: 1})

        await waitFor(() => expect(result.current.data).toEqual({page: 2}))
    })
})