import {useCallback, useEffect, useRef, useState} from "react";

function useDebounce<T>(value:T,delay:number){

    const [debounced, setDebounced]= useState(value)

    useEffect(() => {

        const timeout = setTimeout(()=> setDebounced(value),delay)
        return ()=> clearTimeout(timeout)

    }, [value,delay]);

    return debounced
}


export function useDebounceFn<T extends (...args:any[])=> void>(fn:T, delay:number){


    const fnRef = useRef(fn)
    const timeoutRef = useRef<ReturnType<typeof setTimeout>| undefined>(undefined)

    useEffect(() => {
        fnRef.current=fn
    }, [fn]);

    return useCallback((...args:Parameters<T>) => {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = setTimeout(() => fnRef.current(...args), delay)  // woła REF
    }, [delay])




}