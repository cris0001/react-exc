import {useEffect, useRef, useState} from "react";

function  usePrevious<T>(value:T):T|undefined{

    const refValue = useRef<T | undefined>(undefined)

    useEffect(() => {
        refValue.current = value
    }, [value])

    return refValue.current
}