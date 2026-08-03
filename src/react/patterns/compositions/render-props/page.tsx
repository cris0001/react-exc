'use client'

import {useState} from "react";

function MouseTracker({ render }: { render: (pos: { x: number, y: number }) => React.ReactNode }) {
    const [pos, setPos] = useState({ x: 0, y: 0 });

    return (
        <div onMouseMove={e => setPos({ x: e.clientX, y: e.clientY })}>
            {render(pos)} {/* Ty decydujesz co wyrenderować */}
        </div>
    );
}


const Page= ()=>{

    return <>
        <MouseTracker render={pos => <p>{pos.x}, {pos.y}</p>} />
        <MouseTracker render={pos=> <div>{pos.x}-{pos.y}</div>} />
        </>
}


export default Page
