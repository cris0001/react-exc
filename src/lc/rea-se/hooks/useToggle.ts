import {useCallback, useState} from "react";

function useToggle(initialValue:boolean= false){

    const [toggle, setToggle] = useState(initialValue)

    const handleToggle =()=>{
        setToggle((p)=> !p)
    }

    return [toggle,handleToggle] as const
}