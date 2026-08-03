'use client'

import {useEffect, useRef, useState} from "react"
import type {Post} from "./types"
import {fetchPosts, likePost, deletePost} from "./api"

export function PostList() {
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [pending, setPending] = useState<number[]>([])

    // REF NA PENDING — potrzebny WYŁĄCZNIE do blokady "czy zaczynać".
    //
    // Dlaczego nie wystarczy stan `pending`: odczyt stanu w handlerze
    // czyta wartość z renderu, w którym handler powstał. Przy szybkim
    // klikaniu drugie wywołanie przeczytałoby jeszcze pustą listę.
    //
    // Zauważ, że NIE potrzebujemy tu refa na cały stan (jak w wersji
    // z reducerem) — bo wszystkie ZMIANY robimy updaterami, a te dostają
    // świeżą wartość od Reacta.
    const pendingRef = useRef<Set<number>>(new Set())

    // pomocnicze — trzyma ref i stan zsynchronizowane
    const startPending = (id: number) => {
        pendingRef.current.add(id)          // synchronicznie — blokada działa od razu
        setPending((prev) => [...prev, id]) // dla UI (disabled, opacity)
    }

    const endPending = (id: number) => {
        pendingRef.current.delete(id)
        setPending((prev) => prev.filter((x) => x !== id))
    }

    useEffect(() => {
        let ignore = false

        const load = async () => {
            setLoading(true)
            try {
                const data = await fetchPosts()
                if (!ignore) setPosts(data)
            } catch (err) {
                if (!ignore) setError(err instanceof Error ? err.message : "Błąd pobierania")
            } finally {
                if (!ignore) setLoading(false)
            }
        }

        void load()
        return () => {
            ignore = true
        }
    }, [])

    // ---------- LIKE ----------
    const handleLike = async (id: number) => {
        if (pendingRef.current.has(id)) return

        // SNAPSHOT — tu jest jedyne miejsce, gdzie musimy ODCZYTAĆ stan.
        // `posts` z domknięcia wystarcza, bo ta funkcja NIE jest w useCallback,
        // więc powstaje na nowo przy każdym renderze i widzi aktualne dane.
        const post = posts.find((p) => p.id === id)
        if (!post) return

        const previousLikes = post.likes

        startPending(id)
        setError("")

        // ZMIANA OPTYMISTYCZNA przez updater.
        // prev pochodzi od Reacta, nie z domknięcia — więc nawet gdyby
        // w międzyczasie doszła inna aktualizacja, pracujemy na świeżej liście.
        setPosts((prev) =>
            prev.map((p) => (p.id === id ? {...p, likes: p.likes + 1} : p))
        )

        try {
            await likePost(id)
            endPending(id)
        } catch (err) {
            // ROLLBACK — przywracamy KONKRETNĄ wartość ze snapshotu.
            // Nie -1, bo w międzyczasie mógł dojść kolejny lajk i odejmowanie
            // dałoby stan, którego serwer nigdy nie potwierdził.
            setPosts((prev) =>
                prev.map((p) => (p.id === id ? {...p, likes: previousLikes} : p))
            )
            endPending(id)
            setError(err instanceof Error ? err.message : "Nie udało się polubić")
        }
    }

    // ---------- DELETE ----------
    const handleDelete = async (id: number) => {
        if (pendingRef.current.has(id)) return

        // SNAPSHOT: post ORAZ jego pozycja — bez indeksu nie da się
        // przywrócić go we właściwym miejscu
        const index = posts.findIndex((p) => p.id === id)
        if (index === -1) return

        const post = posts[index]

        startPending(id)
        setError("")

        setPosts((prev) => prev.filter((p) => p.id !== id))

        try {
            await deletePost(id)
            endPending(id)
        } catch (err) {
            // ROLLBACK — wstawiamy na ORYGINALNĄ pozycję, nie na koniec
            setPosts((prev) => {
                const restored = [...prev]   // kopia, bo splice mutuje
                restored.splice(index, 0, post)
                return restored
            })
            endPending(id)
            setError(err instanceof Error ? err.message : "Nie udało się usunąć")
        }
    }

    if (loading) return <p>Ładowanie...</p>

    return (
        <div className="max-w-xl">
            {error && (
                <div
                    role="alert"
                    className="mb-4 p-3 border border-red-300 bg-red-50 text-red-700 rounded flex justify-between items-center"
                >
                    <span>{error}</span>
                    <button onClick={() => setError("")} aria-label="Zamknij komunikat" className="px-2">
                        ✕
                    </button>
                </div>
            )}

            <ul className="flex flex-col gap-2">
                {posts.map((post) => {
                    const isPending = pending.includes(post.id)

                    return (
                        <li
                            key={post.id}
                            className="flex items-center justify-between gap-4 border border-gray-200 p-3 rounded"
                            style={{opacity: isPending ? 0.6 : 1}}
                        >
                            <span>{post.title}</span>

                            <span className="flex items-center gap-2">
                                <span data-testid={`likes-${post.id}`}>{post.likes} ♥</span>

                                <button
                                    onClick={() => handleLike(post.id)}
                                    disabled={isPending}
                                    aria-label={`Polub: ${post.title}`}
                                    className="border border-gray-400 px-2 py-1 rounded disabled:text-gray-300"
                                >
                                    Lubię
                                </button>

                                <button
                                    onClick={() => handleDelete(post.id)}
                                    disabled={isPending}
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

            {posts.length === 0 && <p className="text-gray-500">Brak postów</p>}
        </div>
    )
}

// ----------------------------------------------------------------------------
// PORÓWNANIE Z WERSJĄ NA useReducer
//
// CO ZOSTAŁO IDENTYCZNE:
//   - schemat czterech kroków (snapshot -> optymistycznie -> request -> rollback)
//   - snapshot jako lokalna zmienna przeżywająca await
//   - przywracanie konkretnej wartości, nie odwracanie operacji
//   - przywracanie posta na oryginalny indeks
//   To NIE są cechy reducera — to cechy optimistic update jako wzorca.
//
// CO SIĘ UPROŚCIŁO:
//   - nie ma refa na CAŁY stan. Wszystkie zmiany idą przez updatery
//     (setPosts(prev => ...)), a te dostają świeżą wartość od Reacta.
//   - nie ma typów akcji ani reducera — mniej kodu na start
//
// CO SIĘ SKOMPLIKOWAŁO:
//   - jedna operacja = kilka setState rozsypanych po handlerze.
//     Łatwo zapomnieć o którymś (np. endPending w jednej z gałęzi)
//     i zostawić przycisk zablokowany na zawsze.
//   - logika przejść stanu siedzi w handlerach, więc NIE DA SIĘ jej
//     przetestować unitem — wszystko przez RTL, wolniej i mniej precyzyjnie.
//   - `pending` trzymany w dwóch miejscach (ref + stan) i trzeba je ręcznie
//     synchronizować. W reducerze była jedna ścieżka.
//
// KIEDY WRÓCIĆ DO REDUCERA:
//   - gdy operacji przybywa (edycja, przypinanie, sortowanie...)
//   - gdy chcesz testować przejścia stanu unitami
//   - gdy jedna akcja musi zmienić kilka rzeczy ATOMOWO
//     (tu setError + setPosts + setPending to trzy osobne wywołania,
//      w reducerze to jedna akcja i nie da się ich rozjechać)
// ----------------------------------------------------------------------------
