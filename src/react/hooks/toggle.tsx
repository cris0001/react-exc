import {useCallback, useState} from "react";

function useToggle(initial: boolean) {
    const [value, setValue] = useState(initial)
    const toggle = useCallback(() => setValue(prev => !prev), [])
    return [value, toggle] as const
}