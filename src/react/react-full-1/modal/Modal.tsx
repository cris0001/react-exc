import {ReactNode, useEffect, useRef} from "react";
import {createPortal} from "react-dom";

type ModalProps = {
    isOpen: boolean
    onClose: () => void
    children: ReactNode
}

function useKeyPress(handler: () => void, key: string, enabled: boolean) {

    const handlerRef = useRef(handler)

    useEffect(() => {
        handlerRef.current = handler
    }, [handler]);


    useEffect(() => {
        console.log('xd')
        if (!enabled) return
        const listener = (event: KeyboardEvent) => {
            if (event.key === key) handlerRef.current()
        }
        document.addEventListener('keydown', listener)

        return () => document.removeEventListener('keydown', listener)

    }, [key, enabled]);

}


export function Modal({isOpen, onClose, children}: ModalProps) {

    useKeyPress(onClose, "Escape", isOpen)

    useEffect(() => {
        if (!isOpen) return
        document.body.style.overflow = "hidden"
        return () => {
            document.body.style.overflow = ""
        }   // cleanup przywraca
    }, [isOpen])


    if (!isOpen) return null

    return createPortal(
        <div
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose()
            }} className=" fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div
                className="relative flex flex-col w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                {children}
                <button onClick={onClose}>close</button>
            </div>

        </div>,
        document.body
    );

}