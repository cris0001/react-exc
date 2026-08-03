function curry<T extends (...args:any[])=> any>(fn:T):T{

    return ((...args)=>{
        if(fn.length <= args.length){
            return fn(...args)
        }else{
            return curry(fn.bind(null,...args))
        }

    })  as T
}

function curry(fn: Function) {
    return function curried(...args: any[]) {
        if (args.length >= fn.length) {
            return fn(...args)                              // dość → wywołaj
        }
        return (...next: any[]) => curried(...args, ...next)   // za mało → zbieraj dalej
    }
}