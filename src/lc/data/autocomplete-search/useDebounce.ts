import {useEffect, useState} from "react";


export function useDebounce(value: string, ms: number) {

    const [debounced, setDebounced] = useState(value)


    useEffect(() => {

        const timeout = setTimeout(() => {
            setDebounced(value)
        }, ms)

        return () => clearTimeout(timeout)
    }, [ms, value]);


    return debounced
}