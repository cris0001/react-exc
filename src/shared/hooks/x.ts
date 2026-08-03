// Napisz makePrivate który ukrywa dane — symuluje prywatne pola klasy przez closure:
//
//     przyjmuje initialBalance: number
// zwraca obiekt z metodami:
//
//     deposit(amount) — dodaje do salda
//     withdraw(amount) — odejmuje od salda, ale nie poniżej 0
// getBalance() — zwraca aktualne saldo
//

function makePrivate(initialBalance:number){
    let balance = initialBalance
    return{
        deposit:(amount:number)=> balance += amount,
        withdraw:(amount:number)=> balance - amount >0? balance-amount:0,
        getBalance:()=> balance

    }
}


const account = makePrivate(100)

account.deposit(50)     // saldo: 150
account.withdraw(30)    // saldo: 120
account.withdraw(200)   // saldo: 0 — nie może być ujemne
account.getBalance()    // 0
account.balance



// Napisz makeRateLimiter który:
//
//     przyjmuje limit: number — maksymalna liczba wywołań
// zwraca funkcję która:
//     wykonuje przekazaną funkcję jeśli limit nie został przekroczony
// ignoruje wywołanie gdy limit wyczerpany


function makeRateLimiter(limit:number){

let counter =0
    return ((fn:any)=>{
      if(counter < limit +1){
          counter ++
          fn()
      }

    })
}


const limited = makeRateLimiter(3)

limited(() => console.log('wywołanie'))  // "wywołanie"
limited(() => console.log('wywołanie'))  // "wywołanie"
limited(() => console.log('wywołanie'))  // "wywołanie"
limited(() => console.log('wywołanie'))  // (ignorowane — limit wyczerpany)


export function memoize<T extends (...args: any[]) => any>(fn: T): T {
    const cache = new Map<string, ReturnType<T>>()

    return ((...args: Parameters<T>) => {
        const key = JSON.stringify(args)

        if (cache.has(key)) return cache.get(key)

        const result = fn(...args)
        cache.set(key, result)
        return result
    }) as T
}

// // Napisz makePipeline które pozwala dodawać funkcje
// // i wykonywać je po kolei na wartości


function makePipeline(){

}



//
// const pipeline = makePipeline<number>()
// pipeline.add(x => x * 2)
// pipeline.add(x => x + 1)
// pipeline.add(x => x * 3)
// pipeline.run(5)  // 5 * 2 = 10, 10 + 1 = 11, 11 * 3 = 33