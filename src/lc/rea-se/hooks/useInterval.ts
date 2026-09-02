import {useEffect, useRef} from "react";

function useInterval<T extends (...args:any[])=> any>(callback:T, delay:number){

    const fnRef= useRef(callback)

    useEffect(() => {
        fnRef.current= callback
    }, [callback]);

    useEffect(() => {
        const interval = setInterval(()=>{
            fnRef.current()
        },delay)

        return ()=> clearInterval(interval)

    }, [delay]);




}