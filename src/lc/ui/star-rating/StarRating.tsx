import {useState} from "react";

type StarRatingProps = {
    value: number
    onChange: (rating: number) => void
}


type FakeStarProps = {
    id: number,
    handleHover: (id: number) => void
    handleClick: (id: number) => void
    isFilled: boolean
}


function FakeStar({id, handleHover, isFilled, handleClick}: FakeStarProps) {

    return <button aria-label={`${id} stars`} onClick={() => handleClick(id)} onMouseEnter={() => handleHover(id)}

                   className={`${isFilled ? "bg-yellow-300" : ""} border border-gray-400 rounded-full size-6`}></button>
}

export function StarRating({value, onChange}: StarRatingProps) {

    const [hovered, setHovered] = useState(0)

    const handleHover = (id: number) => {
        setHovered(id)
    }

    const handleClick = (id: number) => {
        onChange(id === value ? 0 : id)
    }

    return <>
        <div onMouseLeave={() => handleHover(0)} className={'flex gap-2 p-4'}>{[1, 2, 3, 4, 5].map((el) => <FakeStar
            handleClick={handleClick}
            isFilled={hovered !== 0 ? el <= hovered : el <= value}
            handleHover={handleHover} key={el}
            id={el}/>)}</div>

    </>
}