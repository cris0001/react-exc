import {useState} from "react";

const STARS_LENGTH= 5

type SingleStarProps={

    index:number,
    value:number,
    handleHover:(index:number) => void
    handleRate:(index:number) => void
}

function SingleStar({handleHover,index,handleRate,value}:SingleStarProps){

    const fillPercent = value >= index ? 100 : value >= index - 0.5 ? 50 : 0

    return (
        <>
            <div className="relative size-6 border border-gray-200 bg-gray-100">
                {/* wypełnienie - żółty pasek od lewej */}
                <div
                    className="absolute inset-y-0 left-0 bg-yellow-400"
                    style={{width: `${fillPercent}%`}}
                />
                <button tabIndex={-1}
                    className="absolute inset-y-0 left-0 w-1/2 z-10"
                    onMouseEnter={() => handleHover(index - 0.5)}
                    onClick={() => handleRate(index - 0.5)}
                />

                <button tabIndex={-1}
                    className="absolute inset-y-0 right-0 w-1/2 z-10"
                    onMouseEnter={() => handleHover(index)}
                    onClick={() => handleRate(index)}
                />
            </div>
        </>
    )
}

function SingleStar2({handleHover,index,handleRate,value}:SingleStarProps){

    const fillPercent = value >= index ? 100 : value >= index - 0.5 ? 50 : 0

    return (
        <>
            <div className="relative text-3xl  ">   {/* WRAPPER - kontener (nie gwiazda) */}
                <span className="text-gray-300">★</span>

                {/* żółta gwiazda - nakładka przycięta do fillPercent */}
                <div
                    className="absolute inset-y-0 left-0 overflow-hidden"
                    style={{width: `${fillPercent}%`}}
                >
                    <span className="text-yellow-400">★</span>
                </div>

                <button tabIndex={-1} onMouseEnter={() => handleHover(index - 0.5)} onClick={() => handleRate(index - 0.5)}
                        className={'absolute inset-y-0 left-0 w-1/2'}/>
                <button tabIndex={-1} onMouseEnter={() => handleHover(index)} onClick={() => handleRate(index)}
                        className={'absolute inset-y-0 right-0 w-1/2'}/>


            </div>
        </>
    )
}

type StarProps={
    readOnly :boolean
} & (
    |{value:number, onChange:(rating:number)=> void, defaultValue:never}
    |{value:never, onChange?:(rating:number)=> void, defaultValue?:number}
    )


export function Star({readOnly=false, value, onChange, defaultValue=0}:StarProps) {
    const isControlled = value !== undefined
    const [rating, setRating] = useState(defaultValue)
    const [hoverRating, setHoverRating] = useState(0)

    const handleHover = (val: number) => {
        if(readOnly) return
        setHoverRating(val)
    }

    const handleRate = (val: number) => {
        if (readOnly) return
        const next = rating === val ? 0 : val
        if (!isControlled) setRating(next)   // uncontrolled → własny stan
        onChange?.(next)                      // zgłoś parentowi
    }

    const val =isControlled?   hoverRating || value : hoverRating || rating



    return (
        <div className={'flex flex-col gap-4'}>
            <div onKeyDown={(e)=>{
                if (readOnly) return
                 if(e.key === 'ArrowRight') {
                     e.preventDefault()
                     setHoverRating((p)=> p >= STARS_LENGTH? STARS_LENGTH: p + 0.5)
                 }
                   if(e.key === 'ArrowLeft') {
                       e.preventDefault()
                       setHoverRating((p)=> p=== 0.5? 0 : p - 0.5)
                   }
                   if(e.key === "Enter") {
                       handleRate(hoverRating)
                   }

            }}
                 tabIndex={0}
                 className="w-fit flex gap-1 p-4"
                 onMouseLeave={(e) =>

                setHoverRating(0)
            }>
                {Array.from({length: STARS_LENGTH}, (_, i) => <SingleStar2 value={val} index={i + 1}
                                                                           handleHover={handleHover}
                                                                           handleRate={handleRate} key={i}/>)}
                {rating}/{STARS_LENGTH}
            </div>


            <div onKeyDown={(e)=>{
                if (readOnly) return
                if(e.key === 'ArrowRight') {
                    e.preventDefault()
                    setHoverRating((p)=> p >= STARS_LENGTH? STARS_LENGTH: p + 0.5)
                }
                if(e.key === 'ArrowLeft') {
                    e.preventDefault()
                    setHoverRating((p)=> p=== 0.5? 0 : p - 0.5)
                }
                if(e.key === "Enter") {
                    handleRate(hoverRating)
                }

            }} tabIndex={0} className="w-fit flex gap-1 p-4" onMouseLeave={() =>
                setHoverRating(0)
            }>


                {Array.from({length: STARS_LENGTH}, (_, i) => <SingleStar value={val} index={i + 1}
                                                                          handleHover={handleHover}
                                                                          handleRate={handleRate} key={i}/>)}
                {rating}/{STARS_LENGTH}
            </div>
        </div>
    )
}