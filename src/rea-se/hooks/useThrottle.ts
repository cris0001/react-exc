import {useCallback, useEffect, useRef, useState} from "react";

function useThrottle<T>(value: T, delay: number) {
    const [throttled, setThrottled] = useState(value)
    const last = useRef(0)

    useEffect(() => {
        const now = Date.now()
        const remaining = delay - (now - last.current)

        if (remaining <= 0) {
            setThrottled(value)
            last.current = now
        } else {
            const timeout = setTimeout(() => {
                setThrottled(value)
                last.current = Date.now()
            }, remaining)
            return () => clearTimeout(timeout)
        }
    }, [value, delay])

    return throttled
}

function useThrottleFn<T extends (...args:any[])=> void>(fn:T, delay:number){

    const last = useRef(0)
const timeout  = useRef<ReturnType<typeof setTimeout>| undefined>(undefined)
    const fnRef=  useRef(fn)

    useEffect(() => {
        fnRef.current=fn
    }, [fn]);


    return useCallback(((...args: Parameters<T>)=>{
        const now = Date.now()
        const remaining = delay - (now-last.current)

        if(remaining <=0){
            if(timeout.current) clearTimeout(timeout.current)
            last.current = now
            fnRef.current(...args)
        }else{
            clearTimeout(timeout.current) // opcjonlanie
            timeout.current= setTimeout(()=>{
                last.current= Date.now()
                fnRef.current(...args)
            },remaining)

        }

    }),[delay])
}