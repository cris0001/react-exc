'use client'

import {useEffect, useOptimistic, useState, useTransition} from "react"
import type {Post} from "./types"
import {fetchPosts, likePost, deletePost} from "./api"

// ============================================================================
// AKCJE OPTYMISTYCZNE — opisują, co ma się chwilowo "wydarzyć" w UI.
// To NIE trafia do prawdziwego stanu; React trzyma to jako nakładkę
// na czas trwania transition.
// ============================================================================

type OptimisticAction =
    | { type: "like"; id: number }
    | { type: "delete"; id: number }

// Funkcja MUSI być czysta — React może ją wywołać wielokrotnie,
// nakładając kolejne oczekujące akcje jedna po drugiej na stan bazowy.
function optimisticReducer(posts: Post[], action: OptimisticAction): Post[] {
    switch (action.type) {
        case "like":
            return posts.map((post) =>
                post.id === action.id ? {...post, likes: post.likes + 1} : post
            )
        case "delete":
            return posts.filter((post) => post.id !== action.id)
        default:
            return posts
    }
}

export function PostList() {
    // STAN PRAWDZIWY — zmieniany TYLKO danymi potwierdzonymi przez serwer
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    // NAKŁADKA OPTYMISTYCZNA.
    // optimisticPosts = posts + wszystkie akcje zakolejkowane w trwających
    // transitionach. Gdy transition się kończy, nakładka znika sama.
    const [optimisticPosts, addOptimistic] = useOptimistic(posts, optimisticReducer)

    // isPending mówi, czy trwa jakikolwiek transition — do wskaźników w UI
    const [isPending, startTransition] = useTransition()

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
    const handleLike = (id: number) => {
        // WSZYSTKO MUSI BYĆ W TRANSITION.
        // addOptimistic poza transitionem nie zadziała — React ostrzeże,
        // bo nie ma "trwającej akcji", do której nakładka miałaby być przypięta.
        startTransition(async () => {
            setError("")

            // ZERO SNAPSHOTU. Nie zapamiętujemy poprzedniej wartości,
            // bo prawdziwy stan (`posts`) w ogóle się nie zmienia.
            // Nakładka istnieje tylko na czas tego transitionu.
            addOptimistic({type: "like", id})

            try {
                await likePost(id)

                // SUKCES — dopiero teraz zmieniamy PRAWDZIWY stan.
                // Bez tego po zniknięciu nakładki licznik wróciłby do starej wartości.
                setPosts((prev) =>
                    prev.map((p) => (p.id === id ? {...p, likes: p.likes + 1} : p))
                )
            } catch (err) {
                // ZERO ROLLBACKU. Nic nie cofamy, bo nic nie zmieniliśmy —
                // `posts` przez cały czas trzymało starą wartość.
                // Nakładka znika wraz z końcem transitionu i UI samo wraca.
                setError(err instanceof Error ? err.message : "Nie udało się polubić")
            }
        })
    }

    // ---------- DELETE ----------
    const handleDelete = (id: number) => {
        startTransition(async () => {
            setError("")

            // ZERO ZAPAMIĘTYWANIA INDEKSU. W wersji ręcznej trzeba było
            // zapisać pozycję, żeby przywrócić post we właściwym miejscu.
            // Tu `posts` nigdy nie traci posta, więc kolejność zostaje sama.
            addOptimistic({type: "delete", id})

            try {
                await deletePost(id)
                setPosts((prev) => prev.filter((p) => p.id !== id))
            } catch (err) {
                setError(err instanceof Error ? err.message : "Nie udało się usunąć")
            }
        })
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

            {/* RENDERUJEMY optimisticPosts, NIE posts.
                To jest jedyne miejsce, gdzie widać różnicę w JSX. */}
            <ul className="flex flex-col gap-2">
                {optimisticPosts.map((post) => (
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
                ))}
            </ul>

            {optimisticPosts.length === 0 && <p className="text-gray-500">Brak postów</p>}
        </div>
    )
}

// ----------------------------------------------------------------------------
// CO ZNIKA WZGLĘDEM WERSJI RĘCZNEJ
//
//   ✗ snapshot poprzedniej wartości        — prawdziwy stan się nie zmienia
//   ✗ akcje *_ROLLBACK                     — nie ma czego cofać
//   ✗ zapamiętywanie indeksu przy usuwaniu  — post nigdy nie znika z `posts`
//   ✗ ref na aktualny stan                  — nie odczytujemy stanu w handlerze
//   ✗ ręczne zarządzanie `pending`          — isPending z useTransition
//
// MODEL MYŚLENIA — inny niż w wersji ręcznej:
//
//   RĘCZNIE:  zmień prawdziwy stan → przy błędzie przywróć poprzedni
//   useOptimistic: NIE ruszaj prawdziwego stanu → pokaż nakładkę →
//                  przy sukcesie zatwierdź, przy błędzie po prostu nic nie rób
//
//   Rollback jest "za darmo", bo nigdy nie było czego psuć.
//
// PUŁAPKI
//   1. addOptimistic MUSI być w transition (startTransition albo form action).
//      Poza nim React ostrzeże i zmiana nie zadziała.
//   2. Trzeba PAMIĘTAĆ o zaktualizowaniu prawdziwego stanu przy sukcesie.
//      Bez tego nakładka zniknie i UI wróci do starej wartości — wygląda
//      jak "lajk się cofnął mimo sukcesu". Najczęstszy błąd przy tym hooku.
//   3. Renderujesz optimisticPosts, ale logika (find, index) powinna
//      operować na `posts` — inaczej działasz na danych, których serwer
//      nie potwierdził.
//   4. isPending jest WSPÓLNY dla wszystkich transitionów — jeśli chcesz
//      wskaźnik per wiersz, potrzebujesz własnego stanu jak w wersji ręcznej.
//
// KIEDY WERSJA RĘCZNA JEST LEPSZA
//   - React 18 (useOptimistic wymaga 19)
//   - potrzebujesz stanu per element (który dokładnie wiersz jest zajęty)
//   - kilka niezależnych operacji naraz z osobnymi wskaźnikami
//   - chcesz testować przejścia stanu unitami
//
// A W PRAKTYCE: przy danych z serwera i tak najczęściej TanStack Query
// (onMutate / onError / onSettled), bo dochodzi cache i invalidacja.
// ----------------------------------------------------------------------------
