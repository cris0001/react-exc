import {useState} from "react";

function useToggle(initialData: boolean = false){

    const [isOpen, setIsOpen] = useState(initialData)

    const toggle = ()=>{
        setIsOpen(prev => !prev)    }

    return [isOpen, toggle] as const


}