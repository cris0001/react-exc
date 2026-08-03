import {useEffect, useState} from "react";

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
    const [value, setValue] = useState<T>(() => {
        const item = window.localStorage.getItem(key)
        return item ? (JSON.parse(item) as T) : initialValue
    })

    useEffect(() => {
        window.localStorage.setItem(key, JSON.stringify(value))
    }, [value, key])

    return [value, setValue]
}

function useLocalStorage2<T>(key: string, initialValue: T): [T, (v: T) => void] {
    const [value, setValue] = useState<T>(() => {
        if (typeof window === 'undefined') return initialValue
        try {
            const item = window.localStorage.getItem(key)
            return item ? (JSON.parse(item) as T) : initialValue
        } catch {
            return initialValue
        }
    })

    useEffect(() => {
        window.localStorage.setItem(key, JSON.stringify(value))
    }, [value, key])

    return [value, setValue]
}