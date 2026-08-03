import {useEffect, useRef, useState} from "react";

function useThrottle<T>(value: T, ms: number): T {
    const [throttled, setThrottled] = useState(value)
    const lastRun = useRef<number>(Date.now())

    useEffect(() => {
        const now = Date.now()
        const remaining = ms - (now - lastRun.current)

        if (remaining <= 0) {
            // minęło już ms → przepuść od razu
            setThrottled(value)
            lastRun.current = now
        } else {
            // jeszcze w oknie → zaplanuj na koniec okna
            const timer = setTimeout(() => {
                setThrottled(value)
                lastRun.current = Date.now()
            }, remaining)
            return () => clearTimeout(timer)
        }
    }, [value, ms])

    return throttled
}