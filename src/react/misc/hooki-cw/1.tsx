import {RefObject, useCallback, useEffect, useRef, useState} from "react";

function useDebounce<T>(value: T, ms: number) {

    const [debounced, setDebounced] = useState<T>(value)

    useEffect(() => {
        const timeout = setTimeout(() => setDebounced(value), ms)
        return () => clearTimeout(timeout)

    }, [value, ms])
    return debounced
}


function useFetch<T>(url: string) {

    const [data, setData] = useState<T | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')


    useEffect(() => {
        const controller = new AbortController();


        const fetchData = async () => {

            try {
                setLoading(true)
                setError('')
                const res = await fetch(url, {signal: controller.signal})
                if (!res.ok) throw new Error(`HTTP ${res.status} `)
                const json = await res.json()
                setData(json)

            } catch (err: any) {
                if (err instanceof Error && err.name === 'AbortError') return
                setError(err instanceof Error ? err.message : 'Coś poszło nie tak')
            } finally {
                if (!controller.signal.aborted) setLoading(false)
            }

        }

        fetchData()

        return () => controller.abort()
    }, [url]);

    return {data, loading, error}
}


function usePreviouss<T>(value: T) {

    const valRef = useRef<T | undefined>(undefined)

    useEffect(() => {
        valRef.current = value
    }, [value]);

    return valRef.current
}


function useToggle(initial: boolean) {

    const [value, setValue] = useState(initial)

    const toggle = useCallback(() => {
        setValue((prev) => !prev)
    }, [])

    return [value, toggle]

}

function useLocalStoragee<T>(key: string, initialValue: T) {

    const [value, setValue] = useState<T>(() => {
        if (typeof window === "undefined") return initialValue
        try {
            const item = window.localStorage.getItem(key)
            return item ? (JSON.parse(item) as T) : initialValue
        } catch {
            return initialValue
        }
    })

    useEffect(() => {
        window.localStorage.setItem(key, JSON.stringify(value))
    }, [value, key]);

    return [value, setValue] as const
}


function onClickOutsidee(ref: RefObject<HTMLElement | null>, handler: (event: MouseEvent) => void) {

    useEffect(() => {

        const listener = (event: MouseEvent) => {
            const el = ref.current

            if (!el || el.contains(event.target as Node)) return
            handler(event)
        }


        document.addEventListener('mousedown', listener)
        return () => document.removeEventListener("mousedown", listener)


    }, [ref, handler]);


}


function useIntervall(callback: () => void, delay: number | null) {

    const savedCallback = useRef(callback)
    useEffect(() => {
        savedCallback.current = callback
    }, [callback])


    useEffect(() => {
        if (delay === null) return
        const interval = setInterval(() => savedCallback.current(), delay)

        return () => clearInterval(interval)
    }, [delay]);
}


function useEventListenerr(type: string, handler: (event: Event) => void, element: Window | HTMLElement = window) {


    const refHandler = useRef(handler)

    useEffect(() => {
        refHandler.current = handler
    }, [handler]);

    useEffect(() => {

        const listener = (event: Event) => {
            refHandler.current(event)
        }

        element.addEventListener(type, listener)


        return () => element.removeEventListener(type, listener)


    }, [type, element]);


}


function useMediaQuery(query: string): boolean {

    const [visible, setVisible] = useState(() => {
        if (typeof window === 'undefined') return false
        return window.matchMedia(query).matches
    })


    // useEffect(() => {
    //     const check = () => {
    //         setVisible(window.matchMedia(query).matches)
    //     }
    //     window.addEventListener('resize', check)
    //     return () => window.removeEventListener('resize', check)
    // }, [query]);


    useEffect(() => {
        const mql = window.matchMedia(query)
        const handler = (e: MediaQueryListEvent) => setVisible(e.matches)
        setVisible(mql.matches)                    // sync na starcie
        mql.addEventListener("change", handler)    // ← na mql, nie window
        return () => mql.removeEventListener("change", handler)
    }, [query])


    return visible
}

function useKeyPress(targetKey: string, handler: () => void) {

    useEffect(() => {

        const listener = (event: KeyboardEvent) => {
            if (event.key === targetKey) handler()
        }

        document.addEventListener('keydown', listener)

        return () => document.removeEventListener('keydown', listener)
    }, [targetKey, handler])

}


function useIntersectionObserver<T extends HTMLElement>() {

    const [visible, setVisible] = useState(false)
    const targetRef = useRef<T | null>(null)

    useEffect(() => {
        const el = targetRef.current
        if (!el) return

        const observer = new IntersectionObserver(([entry]) => {
            setVisible(entry.isIntersecting)
        })

        observer.observe(el)
        return () => observer.disconnect()
    }, []);

    return [targetRef, visible] as const
}


function useTimeout(cb: () => void, delay: number | null) {

    const cbRef = useRef(cb)

    useEffect(() => {
        cbRef.current = cb
    }, [cb]);

    useEffect(() => {

        if (delay === null) return
        const timeout = setTimeout(() => {
            cbRef.current()
        }, delay)

        return () => clearTimeout(timeout)

    }, [delay]);
}


function useCopyToClipboard(): [boolean, (text: string) => Promise<void>] {
    const [copied, setCopied] = useState(false)

    const copy = useCallback(async (text: string) => {
        try {
            await navigator.clipboard.writeText(text)   // async API przeglądarki
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)     // reset flagi po 2s
        } catch {
            setCopied(false)
        }
    }, [])

    return [copied, copy]
}





















































