function myPromiseAll<T>(promises: Array<Promise<T> | T>): Promise<T[]> {
    return new Promise((resolve, reject) => {
        const results: T[] = []
        let done = 0
        if (promises.length === 0) return resolve([])

        promises.forEach((p, i) => {
            Promise.resolve(p)
                .then(val => {
                    results[i] = val
                    done++
                    if (done === promises.length) resolve(results)
                })
                .catch(reject)
        })
    })
}

// T = typ rozwiązanej wartości. Wejście: tablica promisów T (lub gołych T). Wyjście: Promise<T[]>.
//     Uwaga: to zakłada, że wszystkie promisy dają ten sam typ T. Prawdziwy Promise.all z tuplami
// różnych typów wymaga bardziej zaawansowanych typów (mapped tuple types) —
// na LC wystarczy ta wersja, wspomnij że pełny typ wspiera różne typy per pozycja.