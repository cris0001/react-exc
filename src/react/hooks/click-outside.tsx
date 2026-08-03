import {useEffect, RefObject, useRef, useState} from "react"

function useOnClickOutside(
    ref: RefObject<HTMLElement | null>,
    handler: (event: MouseEvent) => void
): void {
    useEffect(() => {
        const listener = (event: MouseEvent) => {
            const el = ref.current
            if (!el || el.contains(event.target as Node)) return
            handler(event)
        }

        document.addEventListener("mousedown", listener)
        return () => document.removeEventListener("mousedown", listener)
    }, [ref, handler])
}





function Dropdown() {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useOnClickOutside(ref, () => setOpen(false))

    return (
        <div ref={ref}>
            <button onClick={() => setOpen(o => !o)}>Menu</button>
            {open && <ul><li>Opcja 1</li><li>Opcja 2</li></ul>}
        </div>
    )
}