// Interfejs ButtonProps z polami: label, onClick, variant (opcjonalne: 'primary' | 'secondary'), disabled (opcjonalne)


import {useRef, useState} from "react";

interface ButtonProps{
    label:string,
    onClick:()=>void,
    variant?: 'primary'| 'secondary'
    disabled?:boolean
}

// Komponent Button używający tych propsów



const Button = ({label,onClick,variant,disabled}:ButtonProps)=>{

    return(
        <>
        <button onClick={onClick} disabled={disabled} className={`${variant? variant==='primary'? 'text-red-500':'text-blue-500':'text-gray-600'}`}>{label}</button>
            </>
    )
}


// useState dla User | null — jawny typ
// useRef dla HTMLInputElement
// Handler onChange dla inputa i onSubmit dla formularza

function Form() {
    const [user, setUser] = useState<User | null>(null)
    const inputRef = useRef<HTMLInputElement>(null);
   const onChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
       console.log(e.target.value)
   }
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
            console.log(e)
    }
    return (
        <form onSubmit={onSubmit}>
            <input ref={inputRef} onChange={onChange} />
            <Button label="Submit" onClick={() => {}} />
        </form>
    );

}
