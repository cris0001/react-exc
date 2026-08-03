function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
    let timer: ReturnType<typeof setTimeout> | undefined

    return ((...args: Parameters<T>) => {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => fn(...args), delay)
    }) as T
}


function throttle<T extends (...args: any[]) => void>(fn: T, delay: number) {
    let lastCall = 0

    return (...args: any[]) => {
        const now = Date.now()
        if (now - lastCall >= delay) {   // minęło co najmniej `delay` → odpal
            lastCall = now
            fn(...args)
        }

    }
}


function throttle2<T extends (...args: any[]) => void>(fn: T, delay: number) {
    let lastCall = 0
    let timer: ReturnType<typeof setTimeout> | undefined

    return (...args: any[]) => {
        const now = Date.now()
        const remaining = delay - (now - lastCall)   // ile ZOSTAŁO do końca okna

        if (remaining <= 0) {
            // minęło dość → odpal od razu (leading)
            if (timer) {
                clearTimeout(timer);
                timer = undefined
            }
            lastCall = now
            fn(...args)
        } else if (!timer) {
            // jesteśmy w oknie → zaplanuj odpalenie na KONIEC okna (trailing)
            timer = setTimeout(() => {
                lastCall = Date.now()
                timer = undefined
                fn(...args)
            }, remaining)
        }
    }
}