function memoize<T extends (...args: any[]) => any>(fn: T) {
    const cache = new Map<string, ReturnType<T>>()

    return ((...args: Parameters<T>) => {
        const key = JSON.stringify(args)
        if (cache.has(key)) return cache.get(key)!
        const res = fn(...args)
        cache.set(key, res)
        return res
    })
}