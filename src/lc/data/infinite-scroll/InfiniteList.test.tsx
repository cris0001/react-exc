import {describe, it, expect, vi, beforeEach} from "vitest"
import {render, screen, waitFor} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {InfiniteList} from "./InfiniteList"
import type {Post} from "./useInfinitePosts"

// ============================================================================
// TESTY KOMPONENTU.
//
// PROBLEM: jsdom NIE MA IntersectionObserver. Bez zamockowania komponent
// wywali się z "IntersectionObserver is not defined".
//
// ROZWIĄZANIE: podstawiamy własną atrapę i przechowujemy callback, żeby
// móc RĘCZNIE "ogłosić", że sentinel wjechał w viewport. To ten sam wzorzec
// co deferred promise — przejmujesz kontrolę nad momentem zdarzenia.
// ============================================================================

// callbacki zarejestrowanych obserwatorów — wywołujemy je ręcznie w testach
let observerCallbacks: IntersectionObserverCallback[] = []

class MockIntersectionObserver implements IntersectionObserver {
    readonly root = null
    readonly rootMargin = ""
    readonly thresholds: readonly number[] = []

    constructor(callback: IntersectionObserverCallback) {
        observerCallbacks.push(callback)
    }

    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] { return [] }
}

// helper — symuluje wjechanie sentinela w viewport
function triggerIntersection(isIntersecting: boolean) {
    observerCallbacks.forEach((cb) =>
        cb(
            [{isIntersecting} as IntersectionObserverEntry],
            {} as IntersectionObserver
        )
    )
}

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


describe("InfiniteList", () => {

    beforeEach(() => {
        observerCallbacks = []
        globalThis.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver
        globalThis.fetch = vi.fn()
    })

    it("renders the first page", async () => {
        vi.mocked(fetch).mockResolvedValueOnce(okResponse(makePosts(1, 10)))

        render(<InfiniteList/>)

        expect(await screen.findByText("Post 1")).toBeInTheDocument()
        expect(screen.getByText("Post 10")).toBeInTheDocument()
    })

    it("shows a loading indicator while fetching", async () => {
        vi.mocked(fetch).mockResolvedValueOnce(okResponse(makePosts(1, 10)))

        render(<InfiniteList/>)

        expect(screen.getByText("Ładowanie...")).toBeInTheDocument()

        await screen.findByText("Post 1")
        expect(screen.queryByText("Ładowanie...")).not.toBeInTheDocument()
    })

    // ---------- AUTOMATYCZNE DOCIĄGANIE ----------
    it("loads the next page when the sentinel becomes visible", async () => {
        vi.mocked(fetch)
            .mockResolvedValueOnce(okResponse(makePosts(1, 10)))
            .mockResolvedValueOnce(okResponse(makePosts(11, 10)))

        render(<InfiniteList/>)
        await screen.findByText("Post 1")

        // ręcznie ogłaszamy, że sentinel wjechał w widok
        triggerIntersection(true)

        expect(await screen.findByText("Post 11")).toBeInTheDocument()
        // stare pozycje NADAL są
        expect(screen.getByText("Post 1")).toBeInTheDocument()
    })

    it("does not load anything while the sentinel is out of view", async () => {
        vi.mocked(fetch).mockResolvedValueOnce(okResponse(makePosts(1, 10)))

        render(<InfiniteList/>)
        await screen.findByText("Post 1")

        triggerIntersection(false)

        await new Promise((r) => setTimeout(r, 20))
        expect(fetch).toHaveBeenCalledTimes(1)   // tylko pobranie z mountu
    })

    // ---------- FALLBACK ----------
    it("loads the next page via the fallback button", async () => {
        vi.mocked(fetch)
            .mockResolvedValueOnce(okResponse(makePosts(1, 10)))
            .mockResolvedValueOnce(okResponse(makePosts(11, 10)))

        const user = userEvent.setup()
        render(<InfiniteList/>)
        await screen.findByText("Post 1")

        await user.click(screen.getByRole("button", {name: "Załaduj więcej"}))

        expect(await screen.findByText("Post 11")).toBeInTheDocument()
    })

    // ---------- KONIEC LISTY ----------
    it("shows the end message and hides the sentinel when there is no more data", async () => {
        vi.mocked(fetch).mockResolvedValueOnce(okResponse(makePosts(1, 3)))

        render(<InfiniteList/>)
        await screen.findByText("Post 1")

        expect(await screen.findByText("To już wszystko")).toBeInTheDocument()
        expect(screen.queryByTestId("sentinel")).not.toBeInTheDocument()
        expect(screen.queryByRole("button", {name: "Załaduj więcej"})).not.toBeInTheDocument()
    })

    it("stops requesting after the end is reached", async () => {
        vi.mocked(fetch).mockResolvedValueOnce(okResponse(makePosts(1, 3)))

        render(<InfiniteList/>)
        await screen.findByText("To już wszystko")

        triggerIntersection(true)

        await new Promise((r) => setTimeout(r, 20))
        expect(fetch).toHaveBeenCalledTimes(1)
    })

    // ---------- BŁĘDY ----------
    it("shows an error with a retry button", async () => {
        vi.mocked(fetch).mockResolvedValueOnce({ok: false, status: 500} as Response)

        render(<InfiniteList/>)

        expect(await screen.findByRole("alert")).toHaveTextContent("HTTP 500")
        expect(screen.getByRole("button", {name: "Spróbuj ponownie"})).toBeInTheDocument()
    })

    it("recovers after a successful retry", async () => {
        vi.mocked(fetch)
            .mockResolvedValueOnce({ok: false, status: 500} as Response)
            .mockResolvedValueOnce(okResponse(makePosts(1, 10)))

        const user = userEvent.setup()
        render(<InfiniteList/>)

        await screen.findByRole("alert")
        await user.click(screen.getByRole("button", {name: "Spróbuj ponownie"}))

        expect(await screen.findByText("Post 1")).toBeInTheDocument()
        expect(screen.queryByRole("alert")).not.toBeInTheDocument()
    })

    it("stops auto-loading while an error is showing", async () => {
        // bez tego observer w kółko próbowałby pobierać mimo błędu
        vi.mocked(fetch).mockResolvedValueOnce({ok: false, status: 500} as Response)

        render(<InfiniteList/>)
        await screen.findByRole("alert")

        triggerIntersection(true)

        await new Promise((r) => setTimeout(r, 20))
        expect(fetch).toHaveBeenCalledTimes(1)
    })
})
