import React, {useState} from "react";
import {Modal} from "./Modal";
import {createPortal} from "react-dom";

function App() {
    const [open, setOpen] = useState(false)
    return (
        <>
            <button onClick={() => setOpen(true)}>Otwórz</button>
            <Modal isOpen={open} onClose={() => setOpen(false)}>
                <p>Treść modala</p>
            </Modal>

            {open && createPortal(
                <Modal isOpen={open} onClose={() => setOpen(false)}>
                    <p>Treść</p>
                </Modal>,
                document.body
            )}
        </>
    )
}