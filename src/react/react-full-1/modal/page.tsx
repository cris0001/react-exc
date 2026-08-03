"use client"


import {Modal} from "./Modal";
import {useState} from "react";

export default function Page() {

    const [isOpen, setIsOpen] = useState(false)
    const [txt, setTxt] = useState('')
    return (
        <>
            <button onClick={() => setIsOpen((prev) => !prev)}>show / hide</button>
            <input className={'border border-red-500'} value={txt} onChange={(e) => setTxt(e.target.value)}/>
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <>
                    <input className={'border border-red-500'} value={txt} onChange={(e) => setTxt(e.target.value)}/>
                </>
            </Modal>
        </>
    )
}
