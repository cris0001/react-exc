import {
    forwardRef,
    useRef,
    useImperativeHandle,
    Ref,
} from "react"

//  forwardRef + useImperativeHandle


type ModalHandle = {
    open: () => void
    close: () => void
}

const Modal = forwardRef<ModalHandle, { title: string }>(
    ({title}, ref) => {
        const dialogRef = useRef<HTMLDialogElement>(null)

        useImperativeHandle(ref, () => ({
            open: () => dialogRef.current?.showModal(),
            close: () => dialogRef.current?.close(),
        }))

        return (
            <dialog ref={dialogRef}>
                <h2>{title}</h2>
            </dialog>
        )
    }
)


function App18() {
    const modalRef = useRef<ModalHandle>(null)
    return (
        <>
            <button onClick={() => modalRef.current?.open()}>Otwórz</button>
            <Modal ref={modalRef} title="Witaj"/>
        </>
    )
}

// REACT 19 — ref jako zwykły prop + useImperativeHandle

type PlayerHandle = {
    play: () => void
    pause: () => void
}

function VideoPlayer({ref, src}: {
    ref: Ref<PlayerHandle>
    src: string
}) {
    const videoRef = useRef<HTMLVideoElement>(null)

    useImperativeHandle(ref, () => ({
        play: () => videoRef.current?.play(),
        pause: () => videoRef.current?.pause(),
    }))

    return <video ref={videoRef} src={src}/>
}


function App19() {
    const playerRef = useRef<PlayerHandle>(null)
    return (
        <>
            <button onClick={() => playerRef.current?.play()}>Play</button>
            <button onClick={() => playerRef.current?.pause()}>Pause</button>
            <VideoPlayer ref={playerRef} src="/film.mp4"/>
        </>
    )
}