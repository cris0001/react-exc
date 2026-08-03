'use client'

import {useEffect} from "react"
import {useInfinitePosts} from "./useInfinitePosts"
import {useIntersectionObserver} from "./useIntersectionObserver"

export function InfiniteList() {
    const {posts, loading, error, hasMore, loadMore, retry} = useInfinitePosts()

    // SENTINEL — pusty element na dole listy. Gdy wjeżdża w viewport,
    // wiemy, że user dojechał do końca.
    //
    // rootMargin "200px" = odpal 200px ZANIM sentinel faktycznie się pokaże.
    // Dzięki temu dane dociągają się, zanim user zobaczy koniec listy.
    //
    // enabled: hasMore && !error — przestajemy obserwować, gdy nie ma czego
    // ładować. Bez tego observer wisiałby i wołał loadMore w kółko.
    const {targetRef, isIntersecting} = useIntersectionObserver<HTMLDivElement>({
        rootMargin: "200px",
        enabled: hasMore && !error,
    })

    // MOSTEK: widoczność sentinela -> pobranie kolejnej strony.
    // Celowo osobny efekt, a nie wywołanie loadMore w callbacku observera —
    // dzięki temu hook observera nic nie wie o pobieraniu danych.
    useEffect(() => {
        if (isIntersecting && hasMore && !loading && !error) {
            loadMore()
        }
    }, [isIntersecting, hasMore, loading, error, loadMore])

    return (
        <div className="max-w-2xl">
            <ul className="flex flex-col gap-3">
                {posts.map((post) => (
                    <li key={post.id} className="border border-gray-200 p-4 rounded">
                        <h2 className="font-bold">{post.title}</h2>
                        <p className="text-sm text-gray-600">{post.body}</p>
                    </li>
                ))}
            </ul>

            {loading && (
                <p className="py-6 text-center text-gray-500">Ładowanie...</p>
            )}

            {error && (
                <div className="py-6 text-center">
                    <p role="alert" className="text-red-600 mb-2">{error}</p>
                    <button
                        onClick={retry}
                        className="border border-gray-400 px-3 py-1 rounded"
                    >
                        Spróbuj ponownie
                    </button>
                </div>
            )}

            {!hasMore && !loading && posts.length > 0 && (
                <p className="py-6 text-center text-gray-500">To już wszystko</p>
            )}

            {/* SENTINEL — niewidoczny, zerowej wysokości.
                aria-hidden, bo dla użytkownika czytnika ekranu nic nie znaczy. */}
            {hasMore && !error && (
                <div ref={targetRef} aria-hidden="true" data-testid="sentinel"/>
            )}

            {/* FALLBACK — przycisk dla klawiatury i na wypadek, gdyby
                observer nie zadziałał (np. lista krótsza niż viewport,
                więc sentinel nigdy nie "wjeżdża" w widok). */}
            {hasMore && !loading && !error && (
                <div className="py-6 text-center">
                    <button
                        onClick={loadMore}
                        className="border border-gray-400 px-4 py-2 rounded"
                    >
                        Załaduj więcej
                    </button>
                </div>
            )}
        </div>
    )
}

// ----------------------------------------------------------------------------
// PODZIAŁ ODPOWIEDZIALNOŚCI
//
//   useIntersectionObserver  — "czy ten element jest widoczny?" (generyczne)
//   useInfinitePosts         — "pobierz i doklej kolejną stronę" (dane)
//   InfiniteList             — łączy jedno z drugim i renderuje
//
// Dzięki temu observer da się użyć do lazy-loadingu obrazków, a hook
// z danymi przetestować bez DOM (IntersectionObserver nie istnieje w jsdom
// i trzeba go mockować — im mniej kodu tego wymaga, tym lepiej).
//
// DLACZEGO PRZYCISK "ZAŁADUJ WIĘCEJ" MIMO AUTOMATU:
//   - nawigacja klawiaturą: nie da się "doscrollować" Tabem
//   - jeśli lista jest krótsza niż ekran, sentinel jest widoczny od razu
//     i logika bywa myląca
//   - czytniki ekranu i tryby oszczędzania danych
//   - to dosłownie 5 linii, a ratuje dostępność
// ----------------------------------------------------------------------------
