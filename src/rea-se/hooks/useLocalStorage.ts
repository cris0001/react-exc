import {useEffect, useState} from "react";

function useLocalStorage<T>(key: string, initial: T) {
    const [value, setValue] = useState<T>(() => {
        if (typeof window === 'undefined') return initial
        try {
            const item = window.localStorage.getItem(key)
            return item ? (JSON.parse(item) as T) : initial
        } catch {
            return initial
        }
    })

    useEffect(() => {
        window.localStorage.setItem(key, JSON.stringify(value))
    }, [value, key])

    return [value, setValue] as const
}