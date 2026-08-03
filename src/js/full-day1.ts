
function memoize<T extends (...args:any[])=> any>(fn:T):T{

    const cache = new Map<string,ReturnType<T>>()

    return ((...args:any[])=>{

        const key = JSON.stringify(args)

        if(cache.has(key)) return cache.get(key)!

        const res = fn(...args)
        cache.set(key,res)
        return res


    }) as T

}


function curry<T extends (...args:any[])=> any>(fn:T):T{

    return((...args: any[])=>{

        if(args.length >= fn.length){
            return fn(...args)
        }else{
            return curry(fn.bind(null,...args))
        }

    }) as T

}


function once<T extends (...args:any[])=> any>(fn:T):T{
    
    let isCalled= false
    let result: ReturnType<T>
    
    return ((...args:any[])=>{
        if(isCalled) return result
        isCalled= true
        result = fn(...args)
        return result
    }) as T
    
}



function debounce<T extends (...args: any[]) => any>(fn: T, ms: number): T {
    let timer: ReturnType<typeof setTimeout>

    return ((...args: any[]) => {
        clearTimeout(timer)
        timer = setTimeout(() => fn(...args), ms)
    }) as T
}



// 1. Z cancel
function debounce<T extends (...args: any[]) => any>(fn: T, ms: number): T & { cancel: () => void } {
    let timer: ReturnType<typeof setTimeout>

    const debounced = ((...args: any[]) => {
        clearTimeout(timer)
        timer = setTimeout(() => fn(...args), ms)
    }) as T & { cancel: () => void }

    debounced.cancel = () => clearTimeout(timer)
    return debounced
}

// 2. Z leading edge (wywołaj od razu, potem czekaj)
function debounce<T extends (...args: any[]) => any>(
    fn: T,
    ms: number,
    options: { leading?: boolean } = {}
): T {
    let timer: ReturnType<typeof setTimeout>
    let lastCall = 0

    return ((...args: any[]) => {
        const now = Date.now()
        if (options.leading && now - lastCall > ms) {
            fn(...args)
        }
        lastCall = now
        clearTimeout(timer)
        timer = setTimeout(() => fn(...args), ms)
    }) as T
}

// 3. Z Promise return value
function debounce<T extends (...args: any[]) => any>(fn: T, ms: number): (...args: Parameters<T>) => Promise<ReturnType<T>> {
    let timer: ReturnType<typeof setTimeout>

    return (...args: Parameters<T>) => new Promise((resolve) => {
        clearTimeout(timer)
        timer = setTimeout(() => resolve(fn(...args)), ms)
    })
}





function throttle<T extends (...args: any[]) => any>(fn: T, ms: number): T{
    let lastCall= 0

    return((...args:any[])=>{
        const now = Date.now()
     if(now - lastCall >= ms){
        lastCall=now
         fn(...args)
     }
    }) as T
}



function withRetry<T extends (...args: any[]) => any>(fn: T, x: number): T{

    return (async(...args:any[])=>{
        for(let i=0; i < x; i ++){
            try{
                const res = await fn(...args)
                return res
            }catch(err){
            if(x-i ===1)throw err

            }
        }
}) as T

}





function witchCache<T extends (...args:any[])=> any>(fn:T):T{
    const cache  = new Map<string, ReturnType<T>>()

    return(async(...args:any[])=>{

        const key = JSON.stringify(args)
            if(cache.has(key)) return cache.get(key)!

        let result = await fn(...args)
        cache.set(key,result)
        return result

    }) as T



}


class LoggerR {
    static instance:LoggerR
    logs:string[]=[]
    static getInstance() {
        if (!LoggerR.instance) LoggerR.instance = new LoggerR();
        return LoggerR.instance;
    }

    log(msg:string) { this.logs.push(msg); }
}



































































