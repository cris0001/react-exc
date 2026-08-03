// ❌ Co tu jest nie tak?
import {useCallback, useEffect, useRef, useState} from "react";


function useDebounce<T>(value:T, ms:number){

    const [debounced, setDebounced] = useState(value)

    useEffect(()=>{
        const timer = setTimeout(()=>setDebounced(value),ms)
    },[ms,value])
return debounced

}