import { useEffect, useRef } from "react";
import {createPortal} from "react-dom";

type ModalProps = {
    title: string,
    close: () => void
}

export function Modal({ title, close }: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null)

    // click-outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const modal = modalRef.current
            if (!modal) return
            if (!modal.contains(e.target as Node)) close()
        }
        window.addEventListener('mousedown', handleClickOutside)
        return () => window.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') close()
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [])

    // focus trap — cykl Tab/Shift+Tab
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key !== 'Tab') return

        const modal = modalRef.current
        if (!modal) return

        const focusable = modal.querySelectorAll<HTMLElement>(
            'button, input, textarea, select, a[href], [tabindex]:not([tabindex="-1"])'
        )
        if (focusable.length === 0) return

        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey) {
            // Shift+Tab na pierwszym → skocz na ostatni
            if (document.activeElement === first) {
                e.preventDefault()
                last.focus()
            }
        } else {
            // Tab na ostatnim → skocz na pierwszy
            if (document.activeElement === last) {
                e.preventDefault()
                first.focus()
            }
        }
    }

    return createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div
                ref={modalRef}
                onKeyDown={handleKeyDown}
                className="bg-white rounded-lg max-w-md w-full mx-4 overflow-hidden"
            >
                <div className="flex justify-between items-center border-b border-gray-200 p-4">
                    <span>{title}</span>
                    <button onClick={close}>close</button>
                </div>
                <div className="h-64 p-4 flex flex-col gap-3">
                    <input autoFocus className="border border-gray-300 rounded px-2 py-1" placeholder="imię" />
                    <input className="border border-gray-300 rounded px-2 py-1" placeholder="email" />
                    <textarea className="border border-gray-300 rounded px-2 py-1" placeholder="wiadomość" />
                    <button className="bg-blue-100 text-white rounded px-4 py-2">z</button>
                </div>
            </div>
        </div>,document.body
    )
}