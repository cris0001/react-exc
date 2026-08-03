export type Post = {
    id: number
    title: string
    likes: number
}

export type PostsState = {
    posts: Post[]
    loading: boolean
    error: string
    // id postów, dla których leci właśnie request — do blokady i wskaźników
    pending: number[]
}

// ============================================================================
// REDUCER POZOSTAJE CZYSTY, MIMO ŻE CAŁA RZECZ JEST O EFEKCIE UBOCZNYM.
//
// Sztuczka polega na tym, że reducer nie wie nic o sieci. Dostaje trzy
// rodzaje akcji na jedną operację:
//   *_OPTIMISTIC  — zastosuj zmianę od razu (przed odpowiedzią serwera)
//   *_SUCCESS     — potwierdź (zdejmij z pending)
//   *_ROLLBACK    — cofnij do stanu sprzed zmiany
//
// Snapshot do cofnięcia NIE jest liczony w reducerze — przychodzi w payloadzie
// akcji ROLLBACK. Dzięki temu reducer nie musi niczego pamiętać ani zgadywać.
// ============================================================================

export type PostsAction =
    | { type: "FETCH_START" }
    | { type: "FETCH_SUCCESS"; payload: Post[] }
    | { type: "FETCH_ERROR"; payload: string }
    | { type: "LIKE_OPTIMISTIC"; payload: { id: number } }
    | { type: "LIKE_SUCCESS"; payload: { id: number } }
    | { type: "LIKE_ROLLBACK"; payload: { id: number; previousLikes: number; error: string } }
    | { type: "DELETE_OPTIMISTIC"; payload: { id: number } }
    | { type: "DELETE_SUCCESS"; payload: { id: number } }
    | { type: "DELETE_ROLLBACK"; payload: { post: Post; index: number; error: string } }
    | { type: "CLEAR_ERROR" }

export const initialState: PostsState = {
    posts: [],
    loading: false,
    error: "",
    pending: [],
}

export function postsReducer(state: PostsState, action: PostsAction): PostsState {
    switch (action.type) {

        case "FETCH_START":
            return {...state, loading: true, error: ""}

        case "FETCH_SUCCESS":
            return {...state, loading: false, posts: action.payload}

        case "FETCH_ERROR":
            return {...state, loading: false, error: action.payload}

        // ---------- LIKE ----------
        case "LIKE_OPTIMISTIC": {
            const {id} = action.payload

            return {
                ...state,
                error: "",
                // +1 od razu — user widzi efekt natychmiast
                posts: state.posts.map((post) =>
                    post.id === id ? {...post, likes: post.likes + 1} : post
                    //               ↑ nowy obiekt tylko dla zmienionego,
                    //                 reszta zachowuje referencje (React.memo działa)
                ),
                pending: [...state.pending, id],
            }
        }

        case "LIKE_SUCCESS":
            // serwer potwierdził — zostaje tak, jak jest, zdejmujemy z pending
            return {
                ...state,
                pending: state.pending.filter((id) => id !== action.payload.id),
            }

        case "LIKE_ROLLBACK": {
            const {id, previousLikes, error} = action.payload

            return {
                ...state,
                error,
                // PRZYWRACAMY KONKRETNĄ WARTOŚĆ ZE SNAPSHOTU, nie robimy -1.
                //
                // Dlaczego to ważne: gdyby w międzyczasie poleciał drugi lajk
                // (likes 12 -> 13 -> 14) i pierwszy request padł, to -1 dałoby
                // 13, czyli stan, którego nigdy nie było. Snapshot mówi wprost:
                // "wróć do 12".
                posts: state.posts.map((post) =>
                    post.id === id ? {...post, likes: previousLikes} : post
                ),
                pending: state.pending.filter((pendingId) => pendingId !== id),
            }
        }

        // ---------- DELETE ----------
        case "DELETE_OPTIMISTIC": {
            const {id} = action.payload

            return {
                ...state,
                error: "",
                posts: state.posts.filter((post) => post.id !== id),
                pending: [...state.pending, id],
            }
        }

        case "DELETE_SUCCESS":
            return {
                ...state,
                pending: state.pending.filter((id) => id !== action.payload.id),
            }

        case "DELETE_ROLLBACK": {
            const {post, index, error} = action.payload

            // WSTAWIAMY NA ORYGINALNĄ POZYCJĘ, nie na koniec.
            // Doklejenie na koniec byłoby widocznym błędem: post "przeskoczyłby"
            // na dół listy po nieudanym usunięciu.
            const restored = [...state.posts]
            restored.splice(index, 0, post)

            return {
                ...state,
                error,
                posts: restored,
                pending: state.pending.filter((id) => id !== post.id),
            }
        }

        case "CLEAR_ERROR":
            return {...state, error: ""}

        default:
            return state
    }
}

// ---------------------------------------------------------------------------
// SELEKTORY — pochodne, liczone z bieżącego stanu
// ---------------------------------------------------------------------------

export function isPending(state: PostsState, id: number): boolean {
    return state.pending.includes(id)
}

export function findPostIndex(posts: Post[], id: number): number {
    return posts.findIndex((post) => post.id === id)
}
