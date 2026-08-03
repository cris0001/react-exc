// ============================================================================
// KLOCEK 5 — observer + disconnect
// ----------------------------------------------------------------------------
// WZORZEC: zamiast listenera -> obiekt observer (przeglądarka go optymalizuje).
//          Cleanup = observer.disconnect().
//          Ten sam wzorzec: IntersectionObserver, ResizeObserver, MutationObserver.
//
//   const observer = new SomeObserver(callback)
//   observer.observe(el)
//   return () => observer.disconnect()
//
// HOOKI TU: useIntersectionObserver (Tier 3, ale warto)
// ============================================================================

import {useEffect, useRef, useState, RefObject} from "react"

// --- useIntersectionObserver (widoczność w viewport) -----------------------
export function useIntersectionObserver<T extends HTMLElement>(options?: IntersectionObserverInit): [RefObject<T | null>, boolean] {
    const ref = useRef<T | null>(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        const observer = new IntersectionObserver(([entry]) => {
            // callback dostaje entries (tablica); bierzemy pierwszy
            setIsVisible(entry.isIntersecting) // czy element jest w viewport
        }, options)
        observer.observe(el) // zacznij obserwować
        return () => observer.disconnect() // przestań (cleanup)
    }, [options])

    return [ref, isVisible]
    // Po co observer zamiast scroll listenera? scroll odpala się setki razy/s
    // (trzeba throttle). Observer woła callback tylko gdy widoczność się zmienia.
    // Zastosowanie: lazy load obrazów, infinite scroll, animacje przy scrollu.
}

// --- BONUS: useResizeObserver (ten sam klocek, inny observer) --------------
export function useResizeObserver<T extends HTMLElement>(): [RefObject<T | null>, { width: number; height: number }] {
    const ref = useRef<T | null>(null)
    const [size, setSize] = useState({width: 0, height: 0})

    useEffect(() => {
        const el = ref.current
        if (!el) return
        const observer = new ResizeObserver(([entry]) => {
            const {width, height} = entry.contentRect
            setSize({width, height})
        })
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    return [ref, size]
    // Dokładnie ten sam wzorzec co useIntersectionObserver — tylko ResizeObserver.
    // Dlatego "jak umiesz jeden observer, umiesz wszystkie".
}