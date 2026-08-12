
import {Modal} from './Modal'
import {useState} from "react";

export default function Page(){

    const [open, setOpen] = useState(false)

    const close = ()=>{
        setOpen(false)
    }



return(

    <div>
        <button onClick={()=> setOpen(true)} > open</button>
        {open &&  <Modal title={'random title'} close={close}/>}
    </div>
)
}