// Napisz makePipeline który:
//
//     przyjmuje tablicę funkcji
// zwraca funkcję która przepuszcza wartość przez wszystkie funkcje po kolei
// ale jeśli jakaś funkcja zwróci null lub undefined — przerywa i zwraca null



function makePipeline<T>(fns: ((x: T) => T | null)[]) {

    return ((x:T)=>{
        let current = x
    for(let i=0; i < fns.length; i ++){
    let res = fns[i](current)
        if (!res) return null
        current=res
    }
    return current
    })
}




const pipeline = makePipeline([
    (x: number) => x * 2,
    (x: number) => x > 5 ? x : null,  // przerywa jeśli <= 5
    (x: number) => x + 1,
])

pipeline(3)   // null  — 3*2=6 > 5 ale wait, 3*2=6 > 5 więc... 7
pipeline(1)   // null  — 1*2=2, 2 > 5? nie → null, przerwij
pipeline(10)  // 21    — 10*2=20, 20 > 5 → 20, 20+1=21





// Napisz makeRetryable który:
//
//     przyjmuje funkcję fn i liczbę maxRetries
// zwraca funkcję która wywołuje fn i jeśli rzuci błąd — próbuje ponownie aż do maxRetries razy



function makeRetryable<T extends () => Promise<any>>(fn: T, maxRetries: number) {


    return async ()=>{


        for(let i = 0; i < maxRetries; i++) {
            try{
                let res= await fn()
                return res
            }catch{

            }
        }
    }
}





const retryable = makeRetryable(async () => {
    // może rzucić błąd
}, 3)

await retryable()  // spróbuje max 3 razy







// Napisz makeStateMachine który:
//     przyjmuje stan początkowy initialState: string
// przyjmuje dozwolone przejścia transitions: Record<string, string[]>
// zwraca obiekt z metodami getState() i transition(nextState)
// transition zmienia stan tylko jeśli przejście jest dozwolone

 function makeStateMachine(initialState:string, transitions:Record<string, string[]>){

    let state= initialState

    return{
        getState:()=> state,
        transition: (nextState:string)=> {
            if(transitions[state].includes(nextState)) state=nextState
        }
    }

}


const machine = makeStateMachine('idle', {
    idle: ['running'],
    running: ['idle', 'paused'],
    paused: ['running', 'idle']
})

machine.getState()          // 'idle'
machine.transition('running')  // ✅ zmienia na 'running'
machine.transition('paused')   // ✅ zmienia na 'paused'
machine.transition('idle')     // ✅ zmienia na 'idle'
machine.transition('paused')   // ❌ ignoruje — z idle nie można do paused



// Napisz makeEventBus który:
//
//     trzyma listenery w closure
// zwraca obiekt z metodami on(event, fn), emit(event, ...args), off(event, fn)


function makeEventBus(){

    let listeners: Record<string, Function[]> = {}

    return{

        on:(event:string, fn:Function)=>{
            if(!listeners[event]) listeners[event]=[]
            listeners[event].push(fn)
        },

        off:(event:string,fn: Function)=>{
          listeners[event]  = listeners[event]?.filter((el)=> el !== fn) ?? []
        }
        ,
        emit: (event:string, ...args:any[])=>{
        listeners[event]?.forEach(fn => fn(...args))
    }
    }

}



const bus = makeEventBus()

const handler = (msg: string) => console.log(msg)
bus.on('click', handler)
bus.emit('click', 'hello')  // "hello"
bus.off('click', handler)
bus.emit('click', 'hello')  // (nic)





// Napisz makeCache który:
//
//     nie przyjmuje argumentów
// zwraca obiekt z metodami set(key, value), get(key), has(key), clear()


function makeCache<T >(){

    const cacheStore = new Map<string, T>()

    return{
    set: (key:string,value:T)=> cacheStore.set(key,value),
        get:(key:string)=>  cacheStore.get(key),
        has:(key:string)=>  cacheStore.has(key) ,
        clear:()=> cacheStore.clear()
    }
}



const cache = makeCache()
cache.set('user', { name: 'Anna' })
cache.has('user')  // true
cache.get('user')  // { name: 'Anna' }
cache.clear()
cache.has('user')  // false




// Napisz makeIdGenerator który:
//
//     nie przyjmuje argumentów
// zwraca funkcję która przy każdym wywołaniu zwraca kolejne unikalne id


function makeIdGenerator(){

    let idCounter = 0

    return(()=> {
        idCounter ++
            return idCounter
    })

}



// Napisz makeToggle który:
//     przyjmuje dwie wartości a i b
// zwraca funkcję która naprzemiennie zwraca a i b przy każdym wywołaniu


function makeToggle(a:string,b:string){

    let isToggled= false

    return(()=>{
        isToggled=!isToggled
        return isToggled ? a : b
    })


}





// Napisz makeHistory który:
//
//     trzyma tablicę wartości
// zwraca obiekt z metodami add(value), undo() (usuwa ostatnią), getAll()


function makeHistory(){
    let values:string[] = []

    return{
        add: (value:string)=> values.push(value),
        undo: () => values.pop(),
        getAll: ()=> values
    }
}



// Napisz makeCounter który:
//
//     trzyma wewnętrzny licznik
// zwraca obiekt z increment(), decrement(), getCount()


function makeCounter(){

    let counter = 0

    return {
        increment:()=> counter++,
        decrement: ()=> counter--,
        getCount:()=> counter
    }

}