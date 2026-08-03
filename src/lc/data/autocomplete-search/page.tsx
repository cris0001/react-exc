'use client'


import {SearchInput} from "./SearchInput";

export default function Page() {

    return (
        <>
            <SearchInput/>
        </>
    )
}


// An autocomplete / search-suggestions input. Fetches matching results as the user types, with debouncing.
// Combines several things you've practiced — debounce, fetch, race handling, loading/error states.
//
//
// Requirements:
//


//
// text input; as the user types, fetch matching results
//
// debounce the input (don't fetch on every keystroke — wait until they pause)
// show a dropdown list of suggestions below the input
// show a loading indicator while fetching
// handle the empty query (don't fetch, clear results)
// handle no results ("No matches")
// clicking a suggestion fills the input and closes the dropdown
// proper cleanup (typing fast shouldn't show stale results)