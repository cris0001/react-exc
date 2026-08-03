import {describe, it, expect, vi, beforeEach} from "vitest"
import {render, screen, waitFor} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {PostList} from "./PostList"
import {fetchPosts, likePost, deletePost} from "./api"

vi.mock("./api", () => ({
    fetchPosts: vi.fn(),
    likePost: vi.fn(),
    deletePost: vi.fn(),
}))

const mockFetch = vi.mocked(fetchPosts)
const mockLike = vi.mocked(likePost)
const mockDelete = vi.mocked(deletePost)

// ============================================================================
// TESTY KOMPONENTU.
//
// KLUCZOWA TECHNIKA: deferred promise — zawieszamy request, żeby móc
// sprawdzić stan POŚREDNI (zmiana już widoczna, serwer jeszcze nie
// odpowiedział). Bez tego optymistyczność jest nieodróżnialna od zwykłego
// czekania na odpowiedź.
// ============================================================================

const posts = [
    {id: 1, title: "Pierwszy", likes: 10},
    {id: 2, title: "Drugi", likes: 20},
    {id: 3, title: "Trzeci", likes: 30},
]

// tworzy promise z zewnętrznym wyłącznikiem
function deferred<T>() {
    let resolve!: (value: T) => void
    let reject!: (reason?: unknown) => void

    const promise = new Promise<T>((res, rej) => {
        resolve = res
        reject = rej
    })

    return {promise, resolve, reject}
}


describe("PostList", () => {

    beforeEach(() => {
        vi.clearAllMocks()
        mockFetch.mockResolvedValue(posts)
    })

    it("renders the posts", async () => {
        render(<PostList/>)

        expect(await screen.findByText("Pierwszy")).toBeInTheDocument()
        expect(screen.getByTestId("likes-1")).toHaveTextContent("10")
    })

    // ---------- LIKE: OPTYMISTYCZNIE ----------
    it("increments the counter BEFORE the server responds", async () => {
        // TO JEST SEDNO — sprawdzamy stan pośredni
        const {promise, resolve} = deferred<{ likes: number }>()
        mockLike.mockReturnValue(promise)

        const user = userEvent.setup()
        render(<PostList/>)
        await screen.findByText("Pierwszy")

        await user.click(screen.getByRole("button", {name: "Polub: Pierwszy"}))

        // request WISI, a licznik już się zmienił
        expect(screen.getByTestId("likes-1")).toHaveTextContent("11")

        resolve({likes: 11})
        await waitFor(() => {
            expect(screen.getByRole("button", {name: "Polub: Pierwszy"})).toBeEnabled()
        })
    })

    it("keeps the incremented value after success", async () => {
        mockLike.mockResolvedValue({likes: 11})

        const user = userEvent.setup()
        render(<PostList/>)
        await screen.findByText("Pierwszy")

        await user.click(screen.getByRole("button", {name: "Polub: Pierwszy"}))

        await waitFor(() => {
            expect(screen.getByRole("button", {name: "Polub: Pierwszy"})).toBeEnabled()
        })
        expect(screen.getByTestId("likes-1")).toHaveTextContent("11")
    })

    // ---------- LIKE: ROLLBACK ----------
    it("rolls the counter back when the request fails", async () => {
        mockLike.mockRejectedValue(new Error("Serwer odrzucił żądanie"))

        const user = userEvent.setup()
        render(<PostList/>)
        await screen.findByText("Pierwszy")

        await user.click(screen.getByRole("button", {name: "Polub: Pierwszy"}))

        expect(await screen.findByRole("alert")).toHaveTextContent("Serwer odrzucił żądanie")
        expect(screen.getByTestId("likes-1")).toHaveTextContent("10")   // wróciło
    })

    it("only rolls back the post that failed", async () => {
        mockLike.mockRejectedValue(new Error("Odrzucono"))

        const user = userEvent.setup()
        render(<PostList/>)
        await screen.findByText("Pierwszy")

        await user.click(screen.getByRole("button", {name: "Polub: Pierwszy"}))
        await screen.findByRole("alert")

        expect(screen.getByTestId("likes-2")).toHaveTextContent("20")   // nietknięty
        expect(screen.getByTestId("likes-3")).toHaveTextContent("30")
    })

    it("lets the user dismiss the error", async () => {
        mockLike.mockRejectedValue(new Error("Odrzucono"))

        const user = userEvent.setup()
        render(<PostList/>)
        await screen.findByText("Pierwszy")

        await user.click(screen.getByRole("button", {name: "Polub: Pierwszy"}))
        await screen.findByRole("alert")

        await user.click(screen.getByRole("button", {name: "Zamknij komunikat"}))

        expect(screen.queryByRole("alert")).not.toBeInTheDocument()
    })

    // ---------- BLOKADA PODWÓJNEGO KLIKNIĘCIA ----------
    it("ignores extra clicks while a request is in flight", async () => {
        const {promise, resolve} = deferred<{ likes: number }>()
        mockLike.mockReturnValue(promise)

        const user = userEvent.setup()
        render(<PostList/>)
        await screen.findByText("Pierwszy")

        const button = screen.getByRole("button", {name: "Polub: Pierwszy"})
        await user.click(button)

        // przycisk jest disabled, więc kolejne kliknięcia nic nie robią
        expect(button).toBeDisabled()
        expect(mockLike).toHaveBeenCalledTimes(1)
        expect(screen.getByTestId("likes-1")).toHaveTextContent("11")   // +1, nie +3

        resolve({likes: 11})
        await waitFor(() => expect(button).toBeEnabled())
    })

    // ---------- DELETE: OPTYMISTYCZNIE ----------
    it("removes the row BEFORE the server responds", async () => {
        const {promise, resolve} = deferred<void>()
        mockDelete.mockReturnValue(promise)

        const user = userEvent.setup()
        render(<PostList/>)
        await screen.findByText("Drugi")

        await user.click(screen.getByRole("button", {name: "Usuń: Drugi"}))

        expect(screen.queryByText("Drugi")).not.toBeInTheDocument()

        resolve()
        await waitFor(() => expect(screen.queryByText("Drugi")).not.toBeInTheDocument())
    })

    it("keeps the row removed after success", async () => {
        mockDelete.mockResolvedValue(undefined)

        const user = userEvent.setup()
        render(<PostList/>)
        await screen.findByText("Drugi")

        await user.click(screen.getByRole("button", {name: "Usuń: Drugi"}))

        await waitFor(() => {
            expect(screen.getAllByRole("listitem")).toHaveLength(2)
        })
        expect(screen.queryByText("Drugi")).not.toBeInTheDocument()
    })

    // ---------- DELETE: ROLLBACK ----------
    it("restores the row when the delete fails", async () => {
        mockDelete.mockRejectedValue(new Error("Nie udało się usunąć"))

        const user = userEvent.setup()
        render(<PostList/>)
        await screen.findByText("Drugi")

        await user.click(screen.getByRole("button", {name: "Usuń: Drugi"}))

        expect(await screen.findByRole("alert")).toBeInTheDocument()
        expect(screen.getByText("Drugi")).toBeInTheDocument()
    })

    it("restores the row at its ORIGINAL position", async () => {
        // gdyby rollback doklejał na koniec, post "przeskoczyłby" na dół
        mockDelete.mockRejectedValue(new Error("Odrzucono"))

        const user = userEvent.setup()
        render(<PostList/>)
        await screen.findByText("Drugi")

        await user.click(screen.getByRole("button", {name: "Usuń: Drugi"}))
        await screen.findByRole("alert")

        const titles = screen.getAllByRole("listitem").map(li =>
            li.textContent?.match(/^(Pierwszy|Drugi|Trzeci)/)?.[0]
        )

        expect(titles).toEqual(["Pierwszy", "Drugi", "Trzeci"])
    })

    it("restores the first row at the front", async () => {
        // WARTOŚĆ GRANICZNA — index 0
        mockDelete.mockRejectedValue(new Error("Odrzucono"))

        const user = userEvent.setup()
        render(<PostList/>)
        await screen.findByText("Pierwszy")

        await user.click(screen.getByRole("button", {name: "Usuń: Pierwszy"}))
        await screen.findByRole("alert")

        const titles = screen.getAllByRole("listitem").map(li =>
            li.textContent?.match(/^(Pierwszy|Drugi|Trzeci)/)?.[0]
        )

        expect(titles[0]).toBe("Pierwszy")
    })

    // ---------- POBIERANIE ----------
    it("shows an error when the initial fetch fails", async () => {
        mockFetch.mockRejectedValue(new Error("Błąd pobierania"))

        render(<PostList/>)

        expect(await screen.findByRole("alert")).toHaveTextContent("Błąd pobierania")
    })
})
