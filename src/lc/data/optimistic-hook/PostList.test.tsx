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
// TESTY WERSJI Z useOptimistic.
//
// Z zewnątrz zachowanie jest IDENTYCZNE jak w wersji ręcznej — i o to chodzi.
// Te same testy przechodzą przy trzech różnych implementacjach
// (reducer / useState / useOptimistic), bo sprawdzają ZACHOWANIE.
//
// Techniką pozostaje deferred promise: zawieszamy request, żeby złapać
// stan pośredni, w którym nakładka optymistyczna jest widoczna.
// ============================================================================

const posts = [
    {id: 1, title: "Pierwszy", likes: 10},
    {id: 2, title: "Drugi", likes: 20},
    {id: 3, title: "Trzeci", likes: 30},
]

function deferred<T>() {
    let resolve!: (value: T) => void
    let reject!: (reason?: unknown) => void

    const promise = new Promise<T>((res, rej) => {
        resolve = res
        reject = rej
    })

    return {promise, resolve, reject}
}


describe("PostList (useOptimistic)", () => {

    beforeEach(() => {
        vi.clearAllMocks()
        mockFetch.mockResolvedValue(posts)
    })

    it("renders the posts", async () => {
        render(<PostList/>)

        expect(await screen.findByText("Pierwszy")).toBeInTheDocument()
        expect(screen.getByTestId("likes-1")).toHaveTextContent("10")
    })

    // ---------- LIKE ----------
    it("shows the optimistic value while the request is pending", async () => {
        const {promise, resolve} = deferred<{ likes: number }>()
        mockLike.mockReturnValue(promise)

        const user = userEvent.setup()
        render(<PostList/>)
        await screen.findByText("Pierwszy")

        await user.click(screen.getByRole("button", {name: "Polub: Pierwszy"}))

        // NAKŁADKA widoczna, mimo że prawdziwy stan wciąż ma 10
        await waitFor(() => {
            expect(screen.getByTestId("likes-1")).toHaveTextContent("11")
        })

        resolve({likes: 11})
        await waitFor(() => {
            expect(screen.getByRole("button", {name: "Polub: Pierwszy"})).toBeEnabled()
        })
    })

    it("keeps the value after a successful like", async () => {
        // dowód, że pamiętamy o zatwierdzeniu prawdziwego stanu —
        // bez setPosts w gałęzi sukcesu wartość wróciłaby do 10
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

    it("returns to the original value when the like fails", async () => {
        // TU NIE MA KODU ROLLBACKU — nakładka po prostu znika,
        // a prawdziwy stan nigdy się nie zmienił
        mockLike.mockRejectedValue(new Error("Serwer odrzucił żądanie"))

        const user = userEvent.setup()
        render(<PostList/>)
        await screen.findByText("Pierwszy")

        await user.click(screen.getByRole("button", {name: "Polub: Pierwszy"}))

        expect(await screen.findByRole("alert")).toHaveTextContent("Serwer odrzucił żądanie")
        await waitFor(() => {
            expect(screen.getByTestId("likes-1")).toHaveTextContent("10")
        })
    })

    it("does not affect other posts on failure", async () => {
        mockLike.mockRejectedValue(new Error("Odrzucono"))

        const user = userEvent.setup()
        render(<PostList/>)
        await screen.findByText("Pierwszy")

        await user.click(screen.getByRole("button", {name: "Polub: Pierwszy"}))
        await screen.findByRole("alert")

        expect(screen.getByTestId("likes-2")).toHaveTextContent("20")
        expect(screen.getByTestId("likes-3")).toHaveTextContent("30")
    })

    // ---------- DELETE ----------
    it("hides the row optimistically", async () => {
        const {promise, resolve} = deferred<void>()
        mockDelete.mockReturnValue(promise)

        const user = userEvent.setup()
        render(<PostList/>)
        await screen.findByText("Drugi")

        await user.click(screen.getByRole("button", {name: "Usuń: Drugi"}))

        await waitFor(() => {
            expect(screen.queryByText("Drugi")).not.toBeInTheDocument()
        })

        resolve()
        await waitFor(() => {
            expect(screen.getAllByRole("listitem")).toHaveLength(2)
        })
    })

    it("restores the row at its original position on failure", async () => {
        // BEZ ZAPAMIĘTYWANIA INDEKSU — kolejność wraca sama,
        // bo prawdziwa lista nigdy nie straciła tego posta
        mockDelete.mockRejectedValue(new Error("Odrzucono"))

        const user = userEvent.setup()
        render(<PostList/>)
        await screen.findByText("Drugi")

        await user.click(screen.getByRole("button", {name: "Usuń: Drugi"}))
        await screen.findByRole("alert")

        await waitFor(() => {
            const titles = screen.getAllByRole("listitem").map(li =>
                li.textContent?.match(/^(Pierwszy|Drugi|Trzeci)/)?.[0]
            )
            expect(titles).toEqual(["Pierwszy", "Drugi", "Trzeci"])
        })
    })

    it("keeps the row removed after a successful delete", async () => {
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

    // ---------- BŁĘDY ----------
    it("shows an error when the initial fetch fails", async () => {
        mockFetch.mockRejectedValue(new Error("Błąd pobierania"))

        render(<PostList/>)

        expect(await screen.findByRole("alert")).toHaveTextContent("Błąd pobierania")
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
})
