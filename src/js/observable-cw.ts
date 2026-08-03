// Napisz makeObservable który:
//
//     przyjmuje obiekt state
// zwraca obiekt z metodami get(key), set(key, value), subscribe(key, fn)
// subscribe rejestruje callback który odpala się gdy dana właściwość się zmieni


function makeObservable<T extends object>(obj: T){


    let state:T = obj
   let listeners: Record<string, Function[]> = {}

    return {
    get:<K extends keyof T>(key:K):T[K]=> state[key],
    set:<K extends keyof T>(key:K,newValue:T[K]):void=> { state[key] = newValue },
       sub:<K extends keyof T>(key:K, fn:(val:T[K])=> void):void=>{

       }
    }

}



const str = makeObservable({ count: 0, name: 'Anna' })

str.sub('count', (val) => console.log('count zmienił się na:', val))

str.get('count')        // 0
str.set('count', 5)     // "count zmienił się na: 5"
str.get('count')        // 5


//  Napisz makeThrottle który:Napisz makeThrottle który:
//
//     przyjmuje funkcję fn i czas ms
// zwraca funkcję która wywołuje fn maksymalnie raz na ms milisekund
// kolejne wywołania w tym czasie są ignorowane



function makeThrottle<T extends (...args: any[])=>any>(fn:T, ms:number):T{

 let lastCall = 0

    return ((...args) => {
        const now = Date.now()
        if(now - lastCall >= ms) {
            lastCall = now
            return fn(...args)
        }

    }) as T


}



const log = makeThrottle((x: number) => {
    console.log('wywołanie:', x)
}, 1000)

log(1)  // "wywołanie: 1"
log(2)  // (ignorowane — za szybko)
log(3)  // (ignorowane — za szybko)
// po 1000ms:
log(4)  // "wywołanie: 4"




// Napisz makeDebounce który:
//
//     przyjmuje funkcję fn i czas ms
// zwraca funkcję która wywołuje fn dopiero po ms milisekundach od ostatniego wywołania
// każde nowe wywołanie resetuje timer



function makeDebounce<T extends (...args: any[]) => any>(fn:T,ms:number):T{

let timer:ReturnType<typeof setTimeout>
return((...args)=>{

    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
}) as T
}

const search = makeDebounce((query: string) => {
    console.log('szukam:', query)
}, 300)

search('a')    // timer reset
search('ab')   // timer reset
search('abc')  // po 300ms → "szukam: abc"


// Napisz makeStack który:
//
//     trzyma historię operacji
// zwraca obiekt z push(item), pop(), peek(), size(), getHistory()
// getHistory() zwraca listę wszystkich operacji jako stringi np. ["push: 1", "push: 2", "pop: 2"]


function makeStack<T>(){

    let arr: T[] = []
    let hist:string[]=[]

    return{
        push:(x:T)=> {
            arr.push(x)
            let h= `push  ${x}`
            hist.push(h)

        },
        pop:()=> {
            let x= arr.pop()
            let h= `pop  ${x}`
            hist.push(h)
            return x
        },
        getHistory:()=> hist,
        peek: () => arr[arr.length - 1],
        size: () =>arr.length
    }

}


const st = makeStack<number>()
st.push(1)
st.push(2)
st.pop()   // 2
st.getHistory()  // ["push: 1", "push: 2", "pop: 2"]





// Napisz makeCounter który:
//
//     przyjmuje initialValue: number
// zwraca obiekt z increment(), decrement(), reset(), getCount()


function makeCounter(x:number){
    let initial = x

    return{
        increment:()=> initial++,
        decrement:()=> initial--,
        reset: ()=> initial=x,
        getCount:()=> initial
    }
}


const counter = makeCounter(10)
counter.increment()  // 11
counter.increment()  // 12
counter.decrement()  // 11
counter.reset()      // 10
counter.getCount()   // 10