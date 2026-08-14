function promiseAll<T>(promises:(T |  Promise<T>)[]): Promise<T[]> {

    return new Promise<T[]>((resolve, reject) => {
        if (promises.length === 0) {
            resolve([])
            return
        }
        const results: T[] = []
        let completed = 0

        promises.forEach((promise, i) => {
            // promise
            Promise.resolve(promise) // dodaje promse wrapper jak ktos poda nie promsie
                .then((wynik) => {
                    results[i] = wynik           // wstaw na POZYCJĘ i (kolejność wejścia!)
                    completed++                  // jeden więcej ukończony
                    if (completed === promises.length) {
                        resolve(results)           // wszystkie gotowe → rozwiąż
                    }
                })
                .catch(reject)                 // którykolwiek błąd → odrzuć cały
        })


    })
}



function promiseAll2<T>( promises: Promise<T>[]): Promise<T[]>{


    return new Promise((resolve, reject)=>{
        if (promises.length === 0) {
            resolve([])
            return
        }
        let completed= 0
        const results: T[] =[]
promises.forEach((promise,i)=>{
    promise.then((res)=>{
        results[i] = res
    }).catch(reject)
})
    })
}
