// window.matchMedia

import {useEffect, useState} from "react";


// useMediaQuery('(min-width: 768px)')      // szerokość >= 768px
// useMediaQuery('(max-width: 600px)')      // szerokość <= 600px
function useMediaQuery(query: string): boolean {

    const [matches, setMatches] = useState<boolean>(() => {
        if (typeof window === 'undefined') return false   // SSR guard
        return window.matchMedia(query).matches
    })


    useEffect(() => {
        const mql = window.matchMedia(query)

        const handler = (e: MediaQueryListEvent) => setMatches(e.matches)

        mql.addEventListener('change', handler)

        return () => mql.removeEventListener('change', handler)
    }, [query])

    return matches
}