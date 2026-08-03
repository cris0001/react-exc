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
