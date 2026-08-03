import {describe, it, expect} from "vitest"
import {
    postsReducer,
    initialState,
    isPending,
    findPostIndex,
    type PostsState,
    type Post,
} from "./postsReducer"

// ============================================================================
// UNIT TESTY REDUCERA — najważniejsza część tego zadania.
// Cała logika optymistyczna (zmiana, potwierdzenie, cofnięcie) jest czysta,
// więc testujesz ją bez sieci, bez renderowania, bez mocków.
// ============================================================================

const posts: Post[] = [
    {id: 1, title: "Pierwszy", likes: 10},
    {id: 2, title: "Drugi", likes: 20},
    {id: 3, title: "Trzeci", likes: 30},
]

const loaded: PostsState = {posts, loading: false, error: "", pending: []}


describe("postsReducer — pobieranie", () => {

    it("sets loading on fetch start", () => {
        const state = postsReducer(initialState, {type: "FETCH_START"})

        expect(state.loading).toBe(true)
        expect(state.error).toBe("")
    })

    it("stores posts on success", () => {
        const state = postsReducer(
            {...initialState, loading: true},
            {type: "FETCH_SUCCESS", payload: posts}
        )

        expect(state.posts).toEqual(posts)
        expect(state.loading).toBe(false)
    })

    it("stores the error on failure", () => {
        const state = postsReducer(
            {...initialState, loading: true},
            {type: "FETCH_ERROR", payload: "Błąd sieci"}
        )

        expect(state.error).toBe("Błąd sieci")
        expect(state.loading).toBe(false)
    })
})


describe("postsReducer — like optymistyczny", () => {

    it("increments the counter immediately", () => {
        const state = postsReducer(loaded, {type: "LIKE_OPTIMISTIC", payload: {id: 2}})

        expect(state.posts[1].likes).toBe(21)
    })

    it("marks the post as pending", () => {
        const state = postsReducer(loaded, {type: "LIKE_OPTIMISTIC", payload: {id: 2}})

        expect(isPending(state, 2)).toBe(true)
    })

    it("does not touch other posts", () => {
        const state = postsReducer(loaded, {type: "LIKE_OPTIMISTIC", payload: {id: 2}})

        expect(state.posts[0].likes).toBe(10)
        expect(state.posts[2].likes).toBe(30)
    })

    it("keeps untouched posts by reference", () => {
        // dzięki temu React.memo na wierszach pominie nietknięte
        const state = postsReducer(loaded, {type: "LIKE_OPTIMISTIC", payload: {id: 2}})

        expect(state.posts[0]).toBe(loaded.posts[0])
        expect(state.posts[1]).not.toBe(loaded.posts[1])   // zmieniony = nowy obiekt
    })

    it("does not mutate the previous state", () => {
        const state = postsReducer(loaded, {type: "LIKE_OPTIMISTIC", payload: {id: 2}})

        expect(loaded.posts[1].likes).toBe(20)
        expect(state).not.toBe(loaded)
    })

    it("clears pending on success without changing the count", () => {
        const optimistic = postsReducer(loaded, {type: "LIKE_OPTIMISTIC", payload: {id: 2}})

        const state = postsReducer(optimistic, {type: "LIKE_SUCCESS", payload: {id: 2}})

        expect(state.posts[1].likes).toBe(21)     // wartość zostaje
        expect(isPending(state, 2)).toBe(false)   // blokada zdjęta
    })
})


describe("postsReducer — rollback like", () => {

    it("restores the snapshot value", () => {
        const optimistic = postsReducer(loaded, {type: "LIKE_OPTIMISTIC", payload: {id: 2}})
        expect(optimistic.posts[1].likes).toBe(21)

        const state = postsReducer(optimistic, {
            type: "LIKE_ROLLBACK",
            payload: {id: 2, previousLikes: 20, error: "Odrzucono"},
        })

        expect(state.posts[1].likes).toBe(20)
    })

    it("shows the error and clears pending", () => {
        const optimistic = postsReducer(loaded, {type: "LIKE_OPTIMISTIC", payload: {id: 2}})

        const state = postsReducer(optimistic, {
            type: "LIKE_ROLLBACK",
            payload: {id: 2, previousLikes: 20, error: "Odrzucono"},
        })

        expect(state.error).toBe("Odrzucono")
        expect(isPending(state, 2)).toBe(false)
    })

    it("restores the exact snapshot even after further increments", () => {
        // TO JEST KLUCZOWY TEST — dlaczego snapshot, a nie "odejmij 1".
        //
        // Dwa lajki w locie: 20 -> 21 -> 22. Pierwszy request pada.
        // Odejmowanie dałoby 21 — stan, którego serwer nigdy nie potwierdził.
        // Snapshot przywraca 20, czyli ostatnią potwierdzoną wartość.
        let state = postsReducer(loaded, {type: "LIKE_OPTIMISTIC", payload: {id: 2}})
        state = postsReducer(state, {type: "LIKE_OPTIMISTIC", payload: {id: 2}})

        expect(state.posts[1].likes).toBe(22)

        state = postsReducer(state, {
            type: "LIKE_ROLLBACK",
            payload: {id: 2, previousLikes: 20, error: "Odrzucono"},
        })

        expect(state.posts[1].likes).toBe(20)   // NIE 21
    })
})


describe("postsReducer — delete optymistyczny", () => {

    it("removes the post immediately", () => {
        const state = postsReducer(loaded, {type: "DELETE_OPTIMISTIC", payload: {id: 2}})

        expect(state.posts).toHaveLength(2)
        expect(state.posts.map(p => p.id)).toEqual([1, 3])
    })

    it("clears pending on success", () => {
        const optimistic = postsReducer(loaded, {type: "DELETE_OPTIMISTIC", payload: {id: 2}})

        const state = postsReducer(optimistic, {type: "DELETE_SUCCESS", payload: {id: 2}})

        expect(state.posts).toHaveLength(2)
        expect(isPending(state, 2)).toBe(false)
    })

    it("does not mutate the previous state", () => {
        const state = postsReducer(loaded, {type: "DELETE_OPTIMISTIC", payload: {id: 2}})

        expect(loaded.posts).toHaveLength(3)
        expect(state.posts).not.toBe(loaded.posts)
    })
})


describe("postsReducer — rollback delete", () => {

    it("restores the post at its ORIGINAL index", () => {
        // TO JEST SEDNO — doklejenie na koniec byłoby widocznym błędem
        const optimistic = postsReducer(loaded, {type: "DELETE_OPTIMISTIC", payload: {id: 2}})
        expect(optimistic.posts.map(p => p.id)).toEqual([1, 3])

        const state = postsReducer(optimistic, {
            type: "DELETE_ROLLBACK",
            payload: {post: posts[1], index: 1, error: "Odrzucono"},
        })

        expect(state.posts.map(p => p.id)).toEqual([1, 2, 3])   // wrócił na SWOJE miejsce
    })

    it("restores the first post at the front", () => {
        // WARTOŚĆ GRANICZNA — index 0
        const optimistic = postsReducer(loaded, {type: "DELETE_OPTIMISTIC", payload: {id: 1}})

        const state = postsReducer(optimistic, {
            type: "DELETE_ROLLBACK",
            payload: {post: posts[0], index: 0, error: "Odrzucono"},
        })

        expect(state.posts.map(p => p.id)).toEqual([1, 2, 3])
    })

    it("restores the last post at the end", () => {
        // WARTOŚĆ GRANICZNA — ostatni index
        const optimistic = postsReducer(loaded, {type: "DELETE_OPTIMISTIC", payload: {id: 3}})

        const state = postsReducer(optimistic, {
            type: "DELETE_ROLLBACK",
            payload: {post: posts[2], index: 2, error: "Odrzucono"},
        })

        expect(state.posts.map(p => p.id)).toEqual([1, 2, 3])
    })

    it("shows the error and clears pending", () => {
        const optimistic = postsReducer(loaded, {type: "DELETE_OPTIMISTIC", payload: {id: 2}})

        const state = postsReducer(optimistic, {
            type: "DELETE_ROLLBACK",
            payload: {post: posts[1], index: 1, error: "Odrzucono"},
        })

        expect(state.error).toBe("Odrzucono")
        expect(isPending(state, 2)).toBe(false)
    })
})


describe("selektory", () => {

    it("isPending is false for an idle post", () => {
        expect(isPending(loaded, 1)).toBe(false)
    })

    it("findPostIndex returns the position", () => {
        expect(findPostIndex(posts, 2)).toBe(1)
    })

    it("findPostIndex returns -1 for a missing post", () => {
        expect(findPostIndex(posts, 999)).toBe(-1)
    })
})


describe("postsReducer — pozostałe", () => {

    it("clears the error", () => {
        const state = postsReducer(
            {...loaded, error: "Coś"},
            {type: "CLEAR_ERROR"}
        )

        expect(state.error).toBe("")
    })

    it("returns the same state for an unknown action", () => {
        // @ts-expect-error — celowo nieistniejąca akcja
        expect(postsReducer(loaded, {type: "NOPE"})).toBe(loaded)
    })
})
