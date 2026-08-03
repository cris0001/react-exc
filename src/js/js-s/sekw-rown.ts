const tasksss = [
    () => fetch("/api/1").then(r => r.json()),
    () => fetch("/api/2").then(r => r.json()),
    () => fetch("/api/3").then(r => r.json()),
]

// SEKWENCYJNIE — jedno po drugim, każde czeka na poprzednie
async function sequential<T>(tasks: (() => Promise<T>)[]): Promise<T[]> {
    const results: T[] = []
    for (const task of tasks) {
        results.push(await task())   // await w pętli → czeka na każde po kolei
    }
    return results
}

// RÓWNOLEGLE — wszystkie naraz
async function parallel<T>(tasks: (() => Promise<T>)[]): Promise<T[]> {
    return Promise.all(tasksss.map(task => task()))   // odpal wszystkie, czekaj razem
}

//
// Sedno różnicy (to jest cała pointa):
//
// sekwencyjnie — await w pętli czeka na każde zadanie, zanim ruszy następne. 3 zadania po 1s = 3s.
//     Używasz, gdy zadania zależą od siebie (drugie potrzebuje wyniku pierwszego) albo chcesz nie przeciążać.
//     równolegle — Promise.all odpala wszystkie naraz, czeka aż wszystkie skończą. 3 zadania po 1s = ~1s (lecą jednocześnie).
// Używasz, gdy są niezależne.
//
//     Pułapka do nazwania: tasks.map(task => task())
//     w parallel — wywołujesz task() od razu dla wszystkich (startują naraz), a Promise.all czeka. W sequential await task() w
// pętli startuje jedno naraz. Zamysł na ściągę: „sekwencyjnie = await w pętli (wolno, zależne); równolegle = Promise.all(map) (szybko, niezależne).
//     Różnica: kiedy startują zadania — po kolei czy wszystkie naraz".