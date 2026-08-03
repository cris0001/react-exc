import React, {useCallback, useEffect, useState} from "react";

const withMousePosition = (Component:React.ReactNode) => (props:any) => {
    const [pos, setPos] = useState({ x: 0, y: 0 })
    useEffect(() => {
        const handler = (e:any) => setPos({ x: e.clientX, y: e.clientY })
        window.addEventListener('mousemove', handler)
        return () => window.removeEventListener('mousemove', handler)
    }, [])
    return <Component {...props} mousePos={pos} ></Component>
}

const Display = ({ mousePos }) => <div>{mousePos.x}, {mousePos.y}</div>
const Enhanced = withMousePosition(Display)



function useMousePosition(){

    const [pos, setPos] = useState({ x: 0, y: 0 })

    useEffect(() => {
        const handler = (e:any) => setPos({ x: e.clientX, y: e.clientY })
        window.addEventListener('mousemove', handler)
        return () => window.removeEventListener('mousemove', handler)
    }, [])

    return pos

}
const withMousePosition2 = (Component) => (props) => {

    const pos = useMousePosition()

    return <Component {...props} mousePos={pos} />
}




const withLocalStorage = (key) => (Component) => (props) => {
    const [value, setValue] = useState(() => {
        const stored = localStorage.getItem(key)
        return stored ? JSON.parse(stored) : null
    })

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value))
    }, [value])

    return <Component {...props} value={value} setValue={setValue} />+
}

// Użycie:
const Enhanced = withLocalStorage('user')(Profile)

function useLocalStorage<T>(key: string, defaultValue: T){
    const [value, setValue] = useState<T>(() => {
        const stored = localStorage.getItem(key)
        return stored ? JSON.parse(stored) : defaultValue
    })

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value))
    }, [value])

    return [value, setValue] as const
}





function FetchData({ url, children }) {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        setLoading(true)
        fetch(url)
            .then(r => r.json())
            .then(d => {
                setData(d)
                setLoading(false)
            })
            .catch(e => {
                setError(e.message)
                setLoading(false)
            })
    }, [url])

    return children({ data, loading, error })
}

// Użycie:
<FetchData url="/api/users">
    {({ data, loading, error }) => {
        if (loading) return <Spinner />
        if (error) return <Error message={error} />
        return <List items={data} />
    }}
</FetchData>




function useFetch(url:string){
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        setLoading(true)
        fetch(url)
            .then(r => r.json())
            .then(d => {
                setData(d)
                setLoading(false)
            })
            .catch(e => {
                setError(e.message)
                setLoading(false)
            })
    }, [url])

    return{data,loading,error}

}


// przepisz HOC + Render Props razem na custom hook.
// Napisz useToggle() i useAutoClose(ms) jako custom hooki. Pokaż przykładowe użycie obu jednocześnie w komponencie.

// Render props — toggle z renderem
function Toggle({ children }) {
    const [on, setOn] = useState(false)
    return children({ on, toggle: () => setOn(o => !o) })
}

// HOC — auto-zamykanie po X ms
const withAutoClose = (ms) => (Component) => (props) => {
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (open) {
            const t = setTimeout(() => setOpen(false), ms)
            return () => clearTimeout(t)
        }
    }, [open])

    return <Component {...props} open={open} setOpen={setOpen} />
}


function useToggle(){
    const [on, setOn] = useState(false)

    const toggle = useCallback(() => setOn(prev => !prev), [])

    return [on, toggle]

}


function useAutoClose(ms:number){

    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (open) {
            const t = setTimeout(() => setOpen(false), ms)
            return () => clearTimeout(t)
        }
    }, [open])

    return [open, setOpen]

}



function Modal(){

    const [on, toggle] = useToggle()
    const [open, setOpen] = useAutoClose(1111)


    if(on) return <div> modal</div>

    return (
        <>
            <button></button>
        </>
    )
}



// Napisz HOC withLogger(Component) który loguje:
// - mount: "Component mounted"
// - unmount: "Component unmounted"
// - każdy rerender: "Component rerendered, props: {...}"


const withLogger = (Component) => (props) => {

    useEffect(() => {
        console.log('component mounted')
        return ()=> console.log('unmounted')
    }, []);
    useEffect(() => {
        console.log('rerender')

    }, [props]);

    return <Component {...props} />

}















