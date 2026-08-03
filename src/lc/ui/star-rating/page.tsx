'use client'

import React, {useState} from "react";
import {StarRating} from "./StarRating";

export default function Page() {

    const [rating, setRating] = useState(0)


    return (
        <>
            <span>star rating</span>
            <StarRating value={rating} onChange={setRating}/>
        </>
    )
}

//
// A star rating component — click to set a rating, hover to preview. Common UI task, tests controlled state and event handling.
//
//     Requirements:
//
// shows 5 stars (filled ★ / empty ☆)
// clicking a star sets the rating (1–5)
// hovering a star previews that rating (stars fill up to the hovered one)
// moving the mouse away shows the actual selected rating again
// clicking the currently selected star again clears the rating (back to 0)
// controlled: takes value and onChange as props