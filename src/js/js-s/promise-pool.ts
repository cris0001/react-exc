async function promisePool<T>(
    tasks: (() => Promise<T>)[],
    limit: number
): Promise<T[]> {
    const results: T[] = []
    let i = 0

    async function worker() {
        while (i < tasks.length) {
            const current = i++
            results[current] = await tasks[current]()
        }
    }

    const workers = Array.from({ length: limit }, () => worker())
    await Promise.all(workers)

    return results
}

const tasks = [
    () => fetch("/api/1").then(r => r.json()),
    () => fetch("/api/2").then(r => r.json()),
    // ...10 zadań
]
// const results = await promisePool(tasks, 2)   // max 2 naraz, wynik: tablica 10