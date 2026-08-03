import {useCallback, useEffect, useRef, useState} from "react";

export function useDebounce<T >(value:T, delay:number){

const [debounced, setDebounced] = useState(value)


    useEffect(() => {

        const timeout = setTimeout(()=>{
            setDebounced(value)
        },delay)



        return ()=> clearTimeout(timeout)

    }, [value, delay]);

    return debounced

}

function useDebounceFn<T extends (...args: any[]) => void>(fn: T, ms: number): T {

    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const fnRef = useRef(fn)

    useEffect(() => { fnRef.current = fn }, [fn])

    return useCallback((...args: Parameters<T>) => {
        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => fnRef.current(...args), ms)
    }, [ms]) as T
}