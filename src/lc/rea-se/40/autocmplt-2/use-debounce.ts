import {useEffect, useState} from "react";

export function  useDebounce<T>(value:T, delay:number){

    const [debounced, setDebounced] = useState(value)

    useEffect(() => {

        let timeout = setTimeout(()=>{
            setDebounced(value)
        },delay)

        return ()=> clearTimeout(timeout)
    }, [delay,value]);

    return debounced

 }