'use client'

import {useEffect, type RefObject} from "react"

// Selektor elementów, na które da się ustawić focus.
// :not([disabled]) — wyłączone przyciski są pomijane w kolejności Tab.
// tabindex="-1" jest wykluczony, bo taki element da się zafokusować
// programowo, ale NIE Tabem.
const FOCUSABLE = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
].join(", ")

// ============================================================================
// FOCUS TRAP — zamyka Tab wewnątrz kontenera.
//
// Po co: bez tego user klawiatury "wypada" z modala na tło, dalej Tabuje
// po niewidocznych linkach i nie wie, gdzie jest. Dla czytnika ekranu
// to jest kompletnie mylące.
// ============================================================================

export function useFocusTrap(
    containerRef: RefObject<HTMLElement | null>,
    isActive: boolean,
) {
    useEffect(() => {
        if (!isActive) return

        const container = containerRef.current
        if (!container) return

        // ZAPAMIĘTAJ, SKĄD PRZYSZLIŚMY — po zamknięciu focus musi wrócić
        // dokładnie na przycisk, który otworzył modal. Inaczej user
        // klawiatury ląduje na początku strony.
        const previouslyFocused = document.activeElement as HTMLElement | null

        const focusables = Array.from(
            container.querySelectorAll<HTMLElement>(FOCUSABLE)
        )

        // Focus na PIERWSZY element, a nie na kontener.
        // Gdyby modal nie miał żadnego elementu focusowalnego, fokusujemy
        // sam kontener (musi mieć tabindex="-1") — inaczej focus zostałby
        // na tle, czyli poza modalem.
        if (focusables.length > 0) {
            focusables[0].focus()
        } else {
            container.focus()
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key !== "Tab") return

            // lista liczona NA NOWO przy każdym Tabie — zawartość modala
            // mogła się zmienić (pojawił się błąd, doszedł przycisk)
            const current = Array.from(
                container.querySelectorAll<HTMLElement>(FOCUSABLE)
            )
            if (current.length === 0) {
                e.preventDefault()
                return
            }

            const first = current[0]
            const last = current[current.length - 1]

            // Shift+Tab z PIERWSZEGO elementu -> zawiń na ostatni
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault()
                last.focus()
                return
            }

            // Tab z OSTATNIEGO elementu -> zawiń na pierwszy
            if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault()
                first.focus()
            }
        }

        document.addEventListener("keydown", handleKeyDown)

        return () => {
            document.removeEventListener("keydown", handleKeyDown)
            // PRZYWRÓCENIE FOCUSA — to jest ta część, o której najczęściej
            // się zapomina, a bez niej modal jest niedostępny z klawiatury.
            previouslyFocused?.focus()
        }
    }, [containerRef, isActive])
}
