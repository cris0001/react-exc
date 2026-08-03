import {describe, it, expect, vi, beforeEach} from "vitest"
import {render, screen, waitFor} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import UsersList from "./UsersList";


// ============================================================
// TESTY KOMPONENTU Z FETCHEM.
// Mockujemy global.fetch, żeby kontrolować, co zwróci każda strona.
// Testujemy ZACHOWANIE paginacji: renderowanie userów, stany przycisków,
// zmianę strony i poprawny URL. Mechanika samego fetcha (abort, race)
// należy do testów useFetch, nie tutaj.
// ============================================================

// helper — buduje odpowiedź jednej strony w kształcie API
function pageResponse(users: unknown[], page: number, total_pages: number) {
    return {
        ok: true,
        json: async () => ({data: users, page, total, total_pages: total_pages}),
    } as Response
}

// skróty do przykładowych userów
const usersPage1 = [
    {id: 1, first_name: "Anna", last_name: "Kowalska", email: "anna@test.pl"},
    {id: 2, first_name: "Piotr", last_name: "Nowak", email: "piotr@test.pl"},
]
const usersPage2 = [
    {id: 3, first_name: "Ewa", last_name: "Wiśniewska", email: "ewa@test.pl"},
    {id: 4, first_name: "Jan", last_name: "Zieliński", email: "jan@test.pl"},
]

const total = 4   // dla pageResponse (total użytkowników)


describe("UsersList", () => {

    beforeEach(() => {
        globalThis.fetch = vi.fn()
    })

    // ---------- RENDER + LOADING ----------
    it("shows loading, then renders the fetched users", async () => {
        vi.mocked(fetch).mockResolvedValueOnce(pageResponse(usersPage1, 1, 2))

        render(<UsersList/>)

        // updating pojawia się od razu (loading = true na starcie fetcha)
        expect(screen.getByText("updating…")).toBeInTheDocument()

        // po rozwiązaniu Promise userzy się pojawiają (findBy czeka)
        expect(await screen.findByText(/Anna Kowalska/)).toBeInTheDocument()
        expect(screen.getByText(/Piotr Nowak/)).toBeInTheDocument()

        // updating znika po załadowaniu
        expect(screen.queryByText("updating…")).not.toBeInTheDocument()
    })

    // ---------- ERROR ----------
    it("shows an error message when the fetch fails", async () => {
        vi.mocked(fetch).mockResolvedValueOnce({
            ok: false,
            status: 500,
        } as Response)

        render(<UsersList/>)

        // useFetch rzuca "Http 500" przy !res.ok
        expect(await screen.findByText(/Http 500/)).toBeInTheDocument()
    })

    it("hides pagination controls on error", async () => {
        vi.mocked(fetch).mockResolvedValueOnce({ok: false, status: 500} as Response)

        render(<UsersList/>)

        await screen.findByText(/Http 500/)

        // przyciski są w bloku {!error && ...} -> nie ma ich przy błędzie
        expect(screen.queryByRole("button", {name: "Next"})).not.toBeInTheDocument()
        expect(screen.queryByRole("button", {name: "Previous"})).not.toBeInTheDocument()
    })

    // ---------- STANY PRZYCISKÓW ----------
    it("disables Previous on the first page", async () => {
        vi.mocked(fetch).mockResolvedValueOnce(pageResponse(usersPage1, 1, 2))

        render(<UsersList/>)
        await screen.findByText(/Anna Kowalska/)

        expect(screen.getByRole("button", {name: "Previous"})).toBeDisabled()
    })

    it("disables Next on the last page", async () => {
        // total_pages = 1 -> jesteśmy od razu na ostatniej stronie
        vi.mocked(fetch).mockResolvedValueOnce(pageResponse(usersPage1, 1, 1))

        render(<UsersList/>)
        await screen.findByText(/Anna Kowalska/)

        expect(screen.getByRole("button", {name: "Next"})).toBeDisabled()
    })

    // ---------- ZMIANA STRONY (najważniejszy) ----------
    it("fetches and shows the next page when Next is clicked", async () => {
        vi.mocked(fetch)
            .mockResolvedValueOnce(pageResponse(usersPage1, 1, 2))   // 1. fetch: strona 1
            .mockResolvedValueOnce(pageResponse(usersPage2, 2, 2))   // 2. fetch: strona 2

        const user = userEvent.setup()
        render(<UsersList/>)

        await screen.findByText(/Anna Kowalska/)   // strona 1 gotowa

        await user.click(screen.getByRole("button", {name: "Next"}))

        // strona 2 się pojawia
        expect(await screen.findByText(/Ewa Wiśniewska/)).toBeInTheDocument()

        // fetch został wywołany z page=2
        expect(fetch).toHaveBeenLastCalledWith(
            expect.stringContaining("page=2"),
            expect.anything(),   // drugi argument to obiekt z signal + headers
        )
    })

    it("goes back to the previous page when Previous is clicked", async () => {
        vi.mocked(fetch)
            .mockResolvedValueOnce(pageResponse(usersPage1, 1, 2))   // start: strona 1
            .mockResolvedValueOnce(pageResponse(usersPage2, 2, 2))   // po Next: strona 2
            .mockResolvedValueOnce(pageResponse(usersPage1, 1, 2))   // po Previous: strona 1

        const user = userEvent.setup()
        render(<UsersList/>)

        await screen.findByText(/Anna Kowalska/)
        await user.click(screen.getByRole("button", {name: "Next"}))
        await screen.findByText(/Ewa Wiśniewska/)

        await user.click(screen.getByRole("button", {name: "Previous"}))

        expect(await screen.findByText(/Anna Kowalska/)).toBeInTheDocument()
        expect(fetch).toHaveBeenLastCalledWith(
            expect.stringContaining("page=1"),
            expect.anything(),
        )
    })

    // ---------- LICZNIK STRON ----------
    it("shows the current page number", async () => {
        vi.mocked(fetch).mockResolvedValueOnce(pageResponse(usersPage1, 1, 4))

        render(<UsersList/>)
        await screen.findByText(/Anna Kowalska/)

        // "page 1 of 4" jest rozbite na węzły, więc szukamy elastycznie
        expect(await screen.findByText(/page 1 of 4/)).toBeInTheDocument()
    })

    // ---------- keepPreviousData ----------
    it("keeps the previous page visible while the next one loads", async () => {
        // druga odpowiedź celowo zawieszona, żeby złapać moment ładowania
        let resolvePage2: (v: Response) => void
        const page2Promise = new Promise<Response>((resolve) => {
            resolvePage2 = resolve
        })

        vi.mocked(fetch)
            .mockResolvedValueOnce(pageResponse(usersPage1, 1, 2))
            .mockReturnValueOnce(page2Promise)   // strona 2 jeszcze nie gotowa

        const user = userEvent.setup()
        render(<UsersList/>)

        await screen.findByText(/Anna Kowalska/)
        await user.click(screen.getByRole("button", {name: "Next"}))

        // strona 2 się ładuje, ale stare dane WCIĄŻ widoczne (keepPreviousData)
        expect(screen.getByText("updating…")).toBeInTheDocument()
        expect(screen.getByText(/Anna Kowalska/)).toBeInTheDocument()   // stara strona nie zniknęła

        // dopiero teraz kończymy ładowanie strony 2
        resolvePage2!(pageResponse(usersPage2, 2, 2))

        await waitFor(() => {
            expect(screen.getByText(/Ewa Wiśniewska/)).toBeInTheDocument()
        })
    })
})