import {useCallback, useEffect, useRef, useState} from "react";

function useThrottle<T>(value: T, delay: number): T {
    const [throttled, setThrottled] = useState(value)
    const lastRun = useRef(0)

    useEffect(() => {
        const now = Date.now()
        const remaining = delay - (now - lastRun.current)   // ile ZOSTAŁO do końca okna

        if (remaining <= 0) {
            setThrottled(value)
            lastRun.current = now
        } else {
            const timer = setTimeout(() => {
                setThrottled(value)
                lastRun.current = Date.now()
            }, remaining)
            return () => clearTimeout(timer)
        }
    }, [value, delay])

    return throttled
}

function useThrottleFn<T extends (...args: any[]) => void>(fn: T, ms: number): T {
    const lastRun = useRef(0)
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
    const fnRef = useRef(fn)

    useEffect(() => { fnRef.current = fn }, [fn])

    return useCallback((...args: Parameters<T>) => {
        const now = Date.now()
        const remaining = ms - (now - lastRun.current)
        if (remaining <= 0) {
            fnRef.current(...args)
            lastRun.current = now
        } else {
            if (timer.current) clearTimeout(timer.current)
            timer.current = setTimeout(() => {
                fnRef.current(...args)
                lastRun.current = Date.now()
            }, remaining)
        }
    }, [ms]) as T
}
