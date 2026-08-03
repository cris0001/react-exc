function memoize<T extends (...args:any[])=> any>(fn:T){
    const cached = new Map<string, ReturnType<T>>()

    return ((...args:any[])=>{

        const key = JSON.stringify(args)
        if(cached.has(key)) return cached.get(key)
        else{
            const result = fn(...args)
            cached.set(key,result)
            return result
        }
    })

}


function memoize2<T extends (...args: any[]) => Promise<any>>(fn: T) {
    const cache = new Map<string, Promise<any>>()

    return ((...args: any[]) => {
        const key = JSON.stringify(args)
        if (cache.has(key)) return cache.get(key)

        const result = fn(...args)      // to Promise
        cache.set(key, result)          // cache'ujesz Promise, nie rozwiązaną wartość

        result.catch(() => cache.delete(key))   // przy błędzie usuń z cache

        return result
    }) as T
}