// ─── throttle (prosty, leading-only) ───
function throttle<T extends (...args: any[]) => void>(fn: T, delay: number) {
    let lastCall = 0

    return (...args: Parameters<T>) => {
        const now = Date.now()
        const remaining = delay - (now - lastCall)

        if (remaining <= 0) {
            lastCall = now
            fn(...args)
        }
        // remaining > 0 → ignoruj (za wcześnie)
    }
}


// ─── throttle2 (leading + trailing, z timeoutem) ───
function throttle2<T extends (...args: any[]) => void>(fn: T, delay: number) {
    let lastCall = 0
    let timer: ReturnType<typeof setTimeout> | undefined

    return (...args: Parameters<T>) => {
        const now = Date.now()
        const remaining = delay - (now - lastCall)

        if (remaining <= 0) {
            // minęło ≥ delay → odpal od razu (leading)
            if (timer) {                    // usuń zaległy trailing (żeby nie było duplikatu)
                clearTimeout(timer)
                timer = undefined
            }
            lastCall = now
            fn(...args)
        } else if (!timer) {
            // w oknie blokady → zaplanuj trailing (raz, tylko jeśli nie ma timera)
            timer = setTimeout(() => {
                lastCall = Date.now()         // świeży czas w momencie odpalenia
                timer = undefined             // zwolnij, by następny trailing mógł się ustawić
                fn(...args)
            }, remaining)
        }
    }
}
