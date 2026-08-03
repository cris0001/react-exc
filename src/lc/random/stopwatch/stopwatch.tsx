import {useEffect, useRef, useState} from "react";

export function Stopwatch(){

    const [time, setTime] = useState(0)

    const interval = useRef<ReturnType<typeof setInterval>| null>(null)


    const handleStart =()=>{
        if (interval.current !== null) return;
        interval.current= setInterval(()=>{
            setTime((t)=> t+ 1)
        },1000)
    }

    function handleStop() {
        if (interval.current !== null) {
            clearInterval(interval.current);
            interval.current = null;
        }
    }

    function handleClear() {

        if (interval.current !== null) {
            clearInterval(interval.current);
            interval.current = null;
        }

        setTime(0)
    }


    useEffect(() => {
        return () => {
            if (interval.current !== null) clearInterval(interval.current);
        };
    }, []);
    return(<div className={'flex flex-col'}>

        {time}
        <button onClick={handleStart}>start</button>
        <button onClick={handleStop}>pause</button>
        <button onClick={handleClear} >clear</button>

        </div>)
}