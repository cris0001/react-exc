import {useEffect, useState} from "react";

function useWindowWidth(){

    const [width, setWidth] = useState(window.innerWidth)

    useEffect(() => {
        const handler = () => setWidth(window.innerWidth)
        window.addEventListener('resize', handler)
        return () => window.removeEventListener('resize', handler)
    }, [])

    return width

}



const withWindowWidth = (Component: React.ComponentType<any>) => (props: any) => {
    const [width, setWidth] = useState(window.innerWidth)

    useEffect(() => {
        const handler = () => setWidth(window.innerWidth)
        window.addEventListener('resize', handler)
        return () => window.removeEventListener('resize', handler)
    }, [])

    return <Component {...props} width={width} />
}

function withWindowWidth2<P>(Component: React.ComponentType<P & { width: number }>) {
    return (props: P) => {
        const [width, setWidth] = useState(window.innerWidth)

        useEffect(() => {
            const handler = () => setWidth(window.innerWidth)
            window.addEventListener('resize', handler)
            return () => window.removeEventListener('resize', handler)
        }, [])

        return <Component {...props} width={width} />
    }
}


type WindowWidthProps = {
    children: (width: number) => React.ReactNode
}

function WindowWidth({ children }: WindowWidthProps) {
    const [width, setWidth] = useState(window.innerWidth)

    useEffect(() => {
        const handler = () => setWidth(window.innerWidth)
        window.addEventListener('resize', handler)
        return () => window.removeEventListener('resize', handler)
    }, [])

    return <>{children(width)}</>
}




const Page = ()=>{

    const width = useWindowWidth()
    return <>{width}
        <WindowWidth>
            {(width) => <p>Szerokość: {width}px</p>}
        </WindowWidth>
    </>
}