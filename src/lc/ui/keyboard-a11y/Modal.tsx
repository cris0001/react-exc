'use client'

import {useEffect, useId, useRef, type ReactNode} from "react"
import {createPortal} from "react-dom"
import {useFocusTrap} from "./useFocusTrap"

type ModalProps = {
    isOpen: boolean
    onClose: () => void
    title: string
    children: ReactNode
}

export function Modal({isOpen, onClose, title, children}: ModalProps) {
    const dialogRef = useRef<HTMLDivElement>(null)
    const titleId = useId()

    // pułapka na focus + przywrócenie go po zamknięciu
    useFocusTrap(dialogRef, isOpen)

    // ESCAPE ZAMYKA — listener na document, bo klawisz może zostać
    // naciśnięty, gdy focus jest na dowolnym elemencie modala.
    useEffect(() => {
        if (!isOpen) return

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
        }

        document.addEventListener("keydown", handleKeyDown)
        return () => document.removeEventListener("keydown", handleKeyDown)
    }, [isOpen, onClose])

    // BLOKADA SCROLLA TŁA — bez tego strona pod modalem przewija się
    // razem z ruchem myszy, co wygląda jak błąd.
    useEffect(() => {
        if (!isOpen) return

        const original = document.body.style.overflow
        document.body.style.overflow = "hidden"

        // cleanup przywraca poprzednią wartość, a nie na sztywno "auto" —
        // strona mogła mieć własne ustawienie
        return () => {
            document.body.style.overflow = original
        }
    }, [isOpen])

    // WCZESNY RETURN PO HOOKACH, nigdy przed.
    // Hooki muszą wykonać się w tej samej kolejności przy każdym renderze —
    // return przed nimi złamałby regułę hooków.
    if (!isOpen) return null

    return createPortal(
        <div
            // OVERLAY. Kliknięcie w tło zamyka, ale tylko gdy kliknięto
            // DOKŁADNIE w overlay (e.target === e.currentTarget).
            // Bez tego warunku kliknięcie w treść modala też by go zamykało,
            // bo zdarzenie bąbelkuje w górę.
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose()
            }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
        >
            <div
                ref={dialogRef}
                role="dialog"
                // aria-modal informuje czytnik, że treść POZA dialogiem
                // jest niedostępna — nie musi jej czytać
                aria-modal="true"
                // powiązanie z nagłówkiem: czytnik ogłosi tytuł przy otwarciu
                aria-labelledby={titleId}
                // tabindex -1 pozwala zafokusować kontener programowo
                // (fallback, gdy w środku nie ma nic focusowalnego)
                tabIndex={-1}
                className="bg-white rounded p-6 max-w-md w-full"
            >
                <h2 id={titleId} className="text-lg font-bold mb-4">
                    {title}
                </h2>

                {children}

                <button
                    onClick={onClose}
                    aria-label="Zamknij"
                    className="absolute top-4 right-4"
                >
                    ✕
                </button>
            </div>
        </div>,
        document.body
    )
}

// ----------------------------------------------------------------------------
// DLACZEGO PORTAL
// Modal renderowany w miejscu wywołania dziedziczy overflow, z-index
// i transform od rodziców — potrafi zostać przycięty albo wylądować pod
// innym elementem. Portal wynosi go bezpośrednio do <body>.
//
// CO JESZCZE ROBI PRAWDZIWA BIBLIOTEKA (Radix/React Aria):
//   - aria-hidden / inert na całej reszcie strony (nie tylko aria-modal)
//   - obsługa zagnieżdżonych modali (stos focus trapów)
//   - kompensacja szerokości scrollbara (bez tego treść "skacze" przy blokadzie)
//   - wsparcie dla <dialog> tam, gdzie jest dostępne
//   - obsługa iOS, gdzie blokada scrolla działa inaczej
//
// KTÓRY ELEMENT FOKUSOWAĆ JAKO PIERWSZY:
// Domyślnie pierwszy focusowalny. Ale przy akcjach destrukcyjnych fokusuje się
// przycisk BEZPIECZNY (Anuluj), żeby Enter przez pomyłkę nic nie skasował.
// ----------------------------------------------------------------------------
