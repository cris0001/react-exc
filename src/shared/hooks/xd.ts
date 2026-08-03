import {useCallback, useEffect, useReducer, useRef} from "react";

const useDebounce = <T extends (...args: Parameters<T>) => void>(
    fn: T,
    ms: number
): T => {
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const fnRef = useRef(fn)

    useEffect(() => { fnRef.current = fn }, [fn])

    return useCallback((...args: Parameters<T>) => {
        clearTimeout(timerRef.current ?? undefined)
        timerRef.current = setTimeout(() => fnRef.current(...args), ms)
    }, [ms]) as T
}

function useDebounce2<T extends (...args: any[]) => void>(fn: T, ms: number): T {

    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const fnRef = useRef(fn)

    useEffect(() => { fnRef.current = fn }, [fn])

    return useCallback((...args: Parameters<T>) => {
        clearTimeout(timerRef.current ?? undefined)
        timerRef.current = setTimeout(
            () => fnRef.current(...args),
        )
    }, [ms]) as T
}



function useDebounceValue<T>(value: T, ms: number): T {


    const [debounced, dispatch] = useReducer((_: T, action: T) => action, value)

    useEffect(() => {
        const timer = setTimeout(() => dispatch(value), ms)
        return () => clearTimeout(timer)
    }, [value, ms])

    return debounced
}

