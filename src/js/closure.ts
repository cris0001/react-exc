
// Napisz funkcję curry która przekształca funkcję
// przyjmującą wiele argumentów na serię funkcji z jednym argumentem

function curry<T extends (...args: any[]) => any>(fn: T) {
    return (...args: any[]) => {
        if (args.length >= fn.length) {
            return fn(...args)
        } else {
            return curry(fn.bind(null, ...args))
        }
    }
}


function add(a, b, c) {
    return a + b + c
}

const curriedAdd = curry(add)

curriedAdd(1)(2)(3) // 6
curriedAdd(1)(2)    // funkcja czekająca na ostatni argument





function memoize<T extends (...args:any[])=>any>(fn:T): T{

    const cache = new Map<string, ReturnType<T>>()

    return ((...args)=>{
        const key = JSON.stringify(args)
        if(cache.has(key)) {
            return cache.get(key)

        }
        else{
            const res = fn(...args)
            cache.set(key,res)
            return res
        }
    }) as T

}

function debounce<T extends (...args:any[])=>any>(fn:T, ms:number){
    let timerId: ReturnType<typeof setTimeout>

        return ((...args)=>{
            clearTimeout(timerId)
            timerId = setTimeout(() => fn(...args), ms)
        }) as T

}


function throttle<T extends (...args:any[])=> any>(fn:T, ms:number){
    let lastCall = 0

    return((...args:any[])=>{
        const now = Date.now()
        if(now - lastCall >= ms){
            fn(...args)
        }
    })

}



function once<T extends (...args:any[])=>any>(fn:T):T{

    let called= false
    let result:ReturnType<T>

    return ((...args)=>{

        if(called) return result
        else {
            let res = fn(...args)
            called= true
            result=res
            return res
        }
    }) as T

}



function curry<T extends (...args:any[])=> any>(fn:T):T{

    return ((...args)=>{
        if(fn.length <= args.length){
            return fn(...args)
        }else{
            return curry(fn.bind(null,...args))
        }

    }) as T
}

























