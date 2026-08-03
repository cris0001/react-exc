'use client'

import {useEffect, useRef, useState} from "react"

// ============================================================================
// HOOK OBSERWUJĄCY, CZY ELEMENT JEST WIDOCZNY.
//
// DLACZEGO IntersectionObserver, A NIE onScroll:
//   - scroll odpala się DZIESIĄTKI razy na sekundę; observer tylko przy
//     faktycznej zmianie widoczności
//   - observer działa poza głównym wątkiem układu — nie wymusza reflow
//   - z onScroll musiałbyś sam liczyć getBoundingClientRect() (kosztowne)
//     i throttlować zdarzenia
// ============================================================================

type Options = {
    // ile procent elementu musi być widoczne, żeby uznać go za widoczny
    threshold?: number
    // margines wokół viewportu — "200px" oznacza "odpal 200px ZANIM element wejdzie".
    // Dzięki temu dane ładują się, zanim user dojedzie do końca listy.
    rootMargin?: string
    // pozwala wyłączyć obserwację (np. gdy nie ma już kolejnych stron)
    enabled?: boolean
}

export function useIntersectionObserver<T extends HTMLElement>({
    threshold = 0,
    rootMargin = "0px",
    enabled = true,
}: Options = {}) {
    const targetRef = useRef<T>(null)
    const [isIntersecting, setIsIntersecting] = useState(false)

    useEffect(() => {
        const element = targetRef.current

        // element jeszcze nie zamontowany albo obserwacja wyłączona
        if (!element || !enabled) return

        const observer = new IntersectionObserver(
            ([entry]) => setIsIntersecting(entry.isIntersecting),
            {threshold, rootMargin}
        )

        observer.observe(element)

        // CLEANUP — bez tego observer żyje po odmontowaniu komponentu
        // i trzyma referencję do elementu (wyciek pamięci).
        return () => observer.disconnect()
    }, [threshold, rootMargin, enabled])

    return {targetRef, isIntersecting}
}

// UWAGA: hook zwraca TYLKO informację "widoczny / niewidoczny".
// Nie wie nic o ładowaniu danych — to zadanie komponentu.
// Dzięki temu da się go użyć też do lazy-loadingu obrazków, animacji
// przy wejściu w viewport, śledzenia widoczności reklam itd.
