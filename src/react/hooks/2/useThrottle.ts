import {useRef} from "react";


function useThrottle<T extends (...args: any[]) => any>(fn: T, ms: number): T {

    const lastRun = useRef<number>(0)
    const timer = useRef<ReturnType<typeof setTimeout>|null>(null)

        return((...args:any[])=>{
            const current = Date.now()
            const remaining = ms - (current- lastRun.current)

            if(remaining <= 0){
                fn(...args)
                lastRun.current= Date.now()
            } else {
                if (timer.current) clearTimeout(timer.current)
                timer.current = setTimeout(() => {
                    fn(...args)
                    lastRun.current = Date.now()
                }, remaining)
            }


        }) as T

    }

function useThrottle2<T extends (...args: any[]) => any>(fn: T, ms: number): T {
    const lastRun = useRef<number>(0)

    return ((...args: any[]) => {
        const now = Date.now()
        if (now - lastRun.current >= ms) {
            fn(...args)
            lastRun.current = now
        }
    }) as T
}