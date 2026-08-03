// ============================================================================
// KLOCEK 1 — ref + listener + cleanup
// ----------------------------------------------------------------------------
// WZORZEC: podpinasz zdarzenie, sprzątasz w cleanupie.
// ZASADA: handler ZAWSZE w zmiennej (nie inline) — inaczej removeEventListener
//         dostaje inną referencję i cleanup nie działa.
//
//   useEffect(() => {
//     const handler = () => {...}
//     target.addEventListener("event", handler)
//     return () => target.removeEventListener("event", handler)
//   }, [deps])
//
// HOOKI TU: useWindowSize, useOnClickOutside (Tier 2),
//           useHover, useKeyPress, useEventListener
// ============================================================================

import {useEffect, useRef, useState, RefObject} from "react"

// --- useWindowSize (target = window) [Tier 2] ------------------------------
export function useWindowSize() {
    // SSR guard TYLKO w initial (initial leci na serwerze, gdzie window nie ma)
    const [size, setSize] = useState(() => ({
        width: typeof window !== "undefined" ? window.innerWidth : 0,
        height: typeof window !== "undefined" ? window.innerHeight : 0,
    }))

    useEffect(() => {
        // w useEffect window ZAWSZE istnieje (efekt leci tylko w przeglądarce)
        const handler = () =>
            setSize({width: window.innerWidth, height: window.innerHeight})
        window.addEventListener("resize", handler)
        return () => window.removeEventListener("resize", handler)
    }, [])

    return size
}

// --- useOnClickOutside (target = document, granica = .contains) [Tier 2] ---
export function useOnClickOutside(
    ref: RefObject<HTMLElement | null>, // nowsze typy React: | null
    handler: (event: MouseEvent) => void
): void {
    useEffect(() => {
        const listener = (event: MouseEvent) => {
            const el = ref.current
            // !el = ref niepodpięty -> nic
            // el.contains(target) = klik WEWNĄTRZ (lub w dziecko) -> nic
            if (!el || el.contains(event.target as Node)) return
            handler(event) // tu dochodzi tylko klik POZA elementem
        }
        // słuchamy na CAŁYM document (klik poza może być gdziekolwiek)
        document.addEventListener("mousedown", listener) // mousedown, nie click
        return () => document.removeEventListener("mousedown", listener)
    }, [ref, handler])
}

// --- useHover (ref tworzony w hooku, listenery na ref.current) -------------
export function useHover<T extends HTMLElement>() {
    const ref = useRef<T | null>(null)
    const [isHovered, setIsHovered] = useState(false)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        // handlery w zmiennych -> ta sama referencja do add i remove
        const onEnter = () => setIsHovered(true)
        const onLeave = () => setIsHovered(false)
        el.addEventListener("mouseenter", onEnter)
        el.addEventListener("mouseleave", onLeave)
        return () => {
            el.removeEventListener("mouseenter", onEnter)
            el.removeEventListener("mouseleave", onLeave)
        }
    }, [])

    return [ref, isHovered] as const // as const -> [RefObject<T>, boolean]
}

// --- useKeyPress (target = document, porównanie event.key) -----------------
export function useKeyPress(targetKey: string, handler: () => void) {
    useEffect(() => {
        const listener = (e: KeyboardEvent) => {
            if (e.key === targetKey) handler() // e.key: "Escape", "Enter", "a"...
        }
        document.addEventListener("keydown", listener)
        return () => document.removeEventListener("keydown", listener)
    }, [targetKey, handler])
}

// użycie: useKeyPress("Escape", () => setOpen(false))

// --- useEventListener (generyczny wrapper; latest ref = patrz KLOCEK 3) ----
export function useEventListener<K extends keyof WindowEventMap>(
    type: K,
    handler: (event: WindowEventMap[K]) => void,
    element: Window | HTMLElement = window
) {
    // latest ref: trzymamy świeży handler, żeby efekt się nie przepinał co render
    const savedHandler = useRef(handler)
    useEffect(() => {
        savedHandler.current = handler
    }, [handler])

    useEffect(() => {
        const listener = (e: Event) => savedHandler.current(e as WindowEventMap[K])
        element.addEventListener(type, listener)
        return () => element.removeEventListener(type, listener)
    }, [type, element])
}