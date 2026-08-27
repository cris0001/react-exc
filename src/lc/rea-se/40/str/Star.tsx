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
                <button
                    className="absolute inset-y-0 left-0 w-1/2 z-10"
                    onMouseEnter={() => handleHover(index - 0.5)}
                    onClick={() => handleRate(index - 0.5)}
                />

                <button
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

                <button onMouseEnter={() => handleHover(index - 0.5)} onClick={() => handleRate(index - 0.5)}
                        className={'absolute inset-y-0 left-0 w-1/2'}/>
                <button onMouseEnter={() => handleHover(index)} onClick={() => handleRate(index)}
                        className={'absolute inset-y-0 right-0 w-1/2'}/>


            </div>
        </>
    )
}


export function Star() {

    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)

    const handleHover = (val: number) => {
        setHoverRating(val)
    }

    const handleRate = (val: number) => {
        setRating((p) => p === val ? 0 : val)
    }

    const value = hoverRating || rating

    return (
        <div className={'flex flex-col gap-4'}>
            <div className="w-fit flex gap-1 p-4" onMouseLeave={() =>
                setHoverRating(0)
            }>
                {Array.from({length: STARS_LENGTH}, (_, i) => <SingleStar value={value} index={i + 1}
                                                                          handleHover={handleHover}
                                                                          handleRate={handleRate} key={i}/>)}
                {rating}/{STARS_LENGTH}
            </div>
            <div className="w-fit flex gap-1 p-4" onMouseLeave={() =>
                setHoverRating(0)
            }>
                {Array.from({length: STARS_LENGTH}, (_, i) => <SingleStar2 value={value} index={i + 1}
                                                                          handleHover={handleHover}
                                                                          handleRate={handleRate} key={i}/>)}
                {rating}/{STARS_LENGTH}
            </div>
        </div>
    )
}