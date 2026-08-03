'use client'

import {useCallback, useEffect, useReducer, useRef} from "react"
import {
    postsReducer,
    initialState,
    isPending,
    findPostIndex,
} from "./postsReducer"
import {fetchPosts, likePost, deletePost} from "./api"

export function PostList() {
    const [state, dispatch] = useReducer(postsReducer, initialState)
    const {posts, loading, error} = state

    // REF NA AKTUALNY STAN.
    //
    // Po co: handlery potrzebują snapshotu ("jaka była wartość PRZED zmianą")
    // w momencie wywołania. Czytanie `state` z domknięcia dałoby wartość
    // z renderu, w którym handler powstał — a przy szybkim klikaniu to już
    // nieaktualne dane (stale closure).
    //
    // Ref aktualizowany przy każdym renderze zawsze trzyma świeży stan.
    const stateRef = useRef(state)
    stateRef.current = state

    useEffect(() => {
        let ignore = false

        const load = async () => {
            dispatch({type: "FETCH_START"})
            try {
                const data = await fetchPosts()
                if (!ignore) dispatch({type: "FETCH_SUCCESS", payload: data})
            } catch (err) {
                if (!ignore) {
                    dispatch({
                        type: "FETCH_ERROR",
                        payload: err instanceof Error ? err.message : "Błąd pobierania",
                    })
                }
            }
        }

        void load()
        return () => {
            ignore = true
        }
    }, [])

    const handleLike = useCallback(async (id: number) => {
        const current = stateRef.current

        // BLOKADA: nie wysyłaj drugiego requestu dla tego samego posta.
        // Czytamy z refa, bo `pending` w stanie może być jeszcze nieodświeżone
        // (setState/dispatch są odroczone — to samo okno co przy double-submit).
        if (isPending(current, id)) return

        const post = current.posts.find((p) => p.id === id)
        if (!post) return

        // ---- 1. SNAPSHOT (zanim cokolwiek zmienimy) ----
        const previousLikes = post.likes

        // ---- 2. ZMIANA OPTYMISTYCZNA (UI reaguje natychmiast) ----
        dispatch({type: "LIKE_OPTIMISTIC", payload: {id}})

        // ---- 3. REQUEST ----
        try {
            await likePost(id)
            dispatch({type: "LIKE_SUCCESS", payload: {id}})
        } catch (err) {
            // ---- 4. ROLLBACK do zapamiętanej wartości ----
            dispatch({
                type: "LIKE_ROLLBACK",
                payload: {
                    id,
                    previousLikes,
                    error: err instanceof Error ? err.message : "Nie udało się polubić",
                },
            })
        }
    }, [])

    const handleDelete = useCallback(async (id: number) => {
        const current = stateRef.current

        if (isPending(current, id)) return

        const index = findPostIndex(current.posts, id)
        if (index === -1) return

        // SNAPSHOT: sam post ORAZ jego pozycja.
        // Bez indeksu nie da się przywrócić go we właściwym miejscu.
        const post = current.posts[index]

        dispatch({type: "DELETE_OPTIMISTIC", payload: {id}})

        try {
            await deletePost(id)
            dispatch({type: "DELETE_SUCCESS", payload: {id}})
        } catch (err) {
            dispatch({
                type: "DELETE_ROLLBACK",
                payload: {
                    post,
                    index,
                    error: err instanceof Error ? err.message : "Nie udało się usunąć",
                },
            })
        }
    }, [])

    if (loading) return <p>Ładowanie...</p>

    return (
        <div className="max-w-xl">
            {error && (
                <div
                    role="alert"
                    className="mb-4 p-3 border border-red-300 bg-red-50 text-red-700 rounded flex justify-between items-center"
                >
                    <span>{error}</span>
                    <button
                        onClick={() => dispatch({type: "CLEAR_ERROR"})}
                        aria-label="Zamknij komunikat"
                        className="px-2"
                    >
                        ✕
                    </button>
                </div>
            )}

            <ul className="flex flex-col gap-2">
                {posts.map((post) => {
                    const pending = isPending(state, post.id)

                    return (
                        <li
                            key={post.id}
                            className="flex items-center justify-between gap-4 border border-gray-200 p-3 rounded"
                            // subtelne przygaszenie w trakcie requestu —
                            // user widzi, że coś jeszcze trwa, ale wartość
                            // jest już zaktualizowana
                            style={{opacity: pending ? 0.6 : 1}}
                        >
                            <span>{post.title}</span>

                            <span className="flex items-center gap-2">
                                <span data-testid={`likes-${post.id}`}>
                                    {post.likes} ♥
                                </span>

                                <button
                                    onClick={() => handleLike(post.id)}
                                    disabled={pending}
                                    aria-label={`Polub: ${post.title}`}
                                    className="border border-gray-400 px-2 py-1 rounded disabled:text-gray-300"
                                >
                                    Lubię
                                </button>

                                <button
                                    onClick={() => handleDelete(post.id)}
                                    disabled={pending}
                                    aria-label={`Usuń: ${post.title}`}
                                    className="border border-gray-400 px-2 py-1 rounded disabled:text-gray-300"
                                >
                                    Usuń
                                </button>
                            </span>
                        </li>
                    )
                })}
            </ul>

            {posts.length === 0 && !loading && (
                <p className="text-gray-500">Brak postów</p>
            )}
        </div>
    )
}

// ----------------------------------------------------------------------------
// WZORZEC — CZTERY KROKI, ZAWSZE TE SAME
//
//   1. SNAPSHOT   zapamiętaj to, do czego trzeba będzie wrócić
//   2. OPTIMISTIC zastosuj zmianę w UI od razu
//   3. REQUEST    wyślij
//   4a. SUCCESS   potwierdź (zwykle nic nie zmienia w UI)
//   4b. ROLLBACK  przywróć snapshot + pokaż błąd
//
// DLACZEGO SNAPSHOT, A NIE ODWROTNA OPERACJA (-1 zamiast "wróć do 12")
//   Przy dwóch lajkach w locie: 12 -> 13 -> 14. Pierwszy request pada.
//   -1 dałoby 13 — stan, którego serwer nigdy nie potwierdził.
//   Snapshot mówi wprost "wróć do 12" i nie zależy od tego, co działo się
//   w międzyczasie.
//
// DLACZEGO REF NA STAN
//   Handler powstaje w konkretnym renderze i "zamraża" widziany wtedy stan.
//   Przy szybkim klikaniu snapshot brany z domknięcia byłby nieaktualny.
//   stateRef.current jest aktualizowany przy każdym renderze -> zawsze świeży.
//   To ta sama zasada, co przy blokadzie double-submit.
//
// CO NA TO REACT QUERY
//   useMutation({
//     onMutate:  zrób snapshot + zastosuj zmianę optymistyczną
//     onError:   przywróć snapshot
//     onSettled: refetch, żeby zsynchronizować się z serwerem
//   })
//   Trzy callbacki = dokładnie te cztery kroki powyżej. Plus refetch na końcu,
//   który dodatkowo koryguje ewentualne rozjazdy z serwerem.
//
// REACT 19: useOptimistic robi to jeszcze prościej dla prostych przypadków —
// zwraca stan optymistyczny, który sam wraca do prawdziwego po zakończeniu
// akcji. Warto wspomnieć na rozmowie.
// ----------------------------------------------------------------------------
