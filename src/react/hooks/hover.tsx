import {RefObject, useCallback, useEffect, useRef, useState} from "react";

export function useHover<T extends HTMLElement>() {

    let ref = useRef<T>(null)
    const [isHovered, setIsHovered] = useState(false)

    useEffect(() => {
        const el = ref.current
        const onEnter = () => setIsHovered(true)
        const onLeave = () => setIsHovered(false)

        el?.addEventListener('mouseenter', onEnter)
        el?.addEventListener('mouseleave', onLeave)

        return () => {
            el?.removeEventListener('mouseenter', onEnter)
            el?.removeEventListener('mouseleave', onLeave)
        }
    }, []);


    return [ref, isHovered] as const
}


function useHover2<T extends HTMLElement>() {
    const [isHovered, setIsHovered] = useState(false)
    const ref = useRef<T | null>(null)

    const callbackRef = useCallback((node: T | null) => {
        const onEnter = () => setIsHovered(true)
        const onLeave = () => setIsHovered(false)

        if (node) {
            node.addEventListener('mouseenter', onEnter)
            node.addEventListener('mouseleave', onLeave)
            ref.current = node
        }
        // cleanup starego elementu React robi, wołając callback z null
    }, [])

    return [callbackRef, isHovered] as const
}

const Test = () => {

    const [ref, hover] = useHover()

    return <>

        <span ref={ref} className={`${hover ? 'text-blue-300' : 'text-red-600'}`}>xd</span>
    </>
}