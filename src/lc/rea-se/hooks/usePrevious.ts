import {useEffect, useRef} from "react";

function usePrevious<T>(value:T){

    const refValue = useRef<T | undefined>(undefined)

    useEffect(() => {
        refValue.current=value
    }, [value]);

    return refValue.current
}