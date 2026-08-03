import {useEffect, useState} from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {

    const [value, setValue] = useState<T>(() => {
        if (typeof window === 'undefined') return initialValue
        // const val = window.localStorage.getItem(key)
        // return val ? JSON.parse(val) : initialValue
        try {
            const val = window.localStorage.getItem(key)
            return val ? JSON.parse(val) : initialValue
        } catch {
            return initialValue
        }
    })

    useEffect(() => {
        if (typeof window !== 'undefined')
            window.localStorage.setItem(key, JSON.stringify(value))
    }, [value, key]);


    return [value, setValue] as const
}