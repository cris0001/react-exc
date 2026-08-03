function myAll<T>(promises: Promise<T>[]): Promise<T[]> {
    return new Promise((resolve, reject) => {
        const results: T[] = []
        let completed = 0

        if (promises.length === 0) {
            resolve([])
            return
        }

        promises.forEach((p, i) => {
            Promise.resolve(p)                    // opakowanie, gdyby to nie był promise
                .then((value) => {
                    results[i] = value            // wynik na SWOJE miejsce (kolejność!)
                    completed++
                    if (completed === promises.length) {
                        resolve(results)          // wszystkie gotowe → zwróć tablicę
                    }
                })
                .catch(reject)                    // pierwszy błąd → odrzuć całość
        })
    })
}


function myRace<T>(promises: Promise<T>[]): Promise<T> {
    return new Promise((resolve, reject) => {
        promises.forEach((p) => {
            Promise.resolve(p).then(resolve, reject)   // pierwszy wygrywa
        })
    })
}