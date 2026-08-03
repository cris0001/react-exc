import {useState} from "react";


const MIN=0
const MAX=100

export function Counter(){


    const [counter, setCounter] = useState(0)
    const [step, setStep]  =useState(1)

const increase=()=>{
        setCounter((prev)=> prev + step >MAX? MAX: prev+step)
}

    const decrease=()=>{
        setCounter((prev)=> prev - step <MIN ? MIN: prev-step)
    }


    const reset = ()=>{
        setCounter(0)
    }

    return(
        <div className={'flex flex-col items-center justify-center'}>

            <strong>{counter}</strong>
            <div className={'flex gap-2'}>
                <button disabled={counter - 10 < MIN}  onClick={()=> setCounter((prev)=> prev -10)} className={'border border-gray-200 rounded p1 px-2'}>-10</button>
                <button disabled={counter - step < MIN} onClick={decrease} className={'border border-gray-200 rounded p1 px-2'}>-</button>
                <input min={1} type={'number'}  value={step} onChange={(e)=>  setStep(Number(e.target.value) || 1)} className={'w-[50px] border border-gray-200 rounded p1 px-2'} />
                <button disabled={counter + step > MAX} onClick={increase} className={'border border-gray-200 rounded p1 px-2'}>+</button>
                <button disabled={counter + 10 > MAX}  onClick={()=> setCounter((prev)=> prev +10)}  className={'border border-gray-200 rounded p1 px-2'}>+10</button>
            </div>
<button onClick={reset} >reset</button>
        </div>
    )
}