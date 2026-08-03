import {useEffect, useState} from "react";

export function useDebounce<T>(value:T, ms:number){

    const [debounced, setDebounced] = useState(value)


    useEffect(()=>{

        const timeout = setTimeout(()=>{
            setDebounced(value)
        },ms)


        return ()=> clearTimeout(timeout)
    },[ms,value])

    return debounced
}