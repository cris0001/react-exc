import {createPortal} from "react-dom"
import {useState, ReactNode} from "react"

type ModalProps = {
    isOpen: boolean
    onClose: () => void
    children: ReactNode
}

export function Modal({isOpen, onClose, children}: ModalProps) {
    if (!isOpen) return null

    return createPortal(
        <div className="overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                {children}
                <button onClick={onClose}>Zamknij</button>
            </div>
        </div>,
        document.body
    )

    //
    // return (
    //     <div className="overlay" onClick={onClose}>
    //         <div className="modal" onClick={(e) => e.stopPropagation()}>
    //             {children}
    //             <button onClick={onClose}>Zamknij</button>
    //         </div>
    //     </div>
    // )


}