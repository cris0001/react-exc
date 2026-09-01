function curry<T extends (...args:any[])=> any>(fn:T){

   return((...args:any[])=>{
       if(args.length >= fn.length){
           return fn(...args)
       }else{
           return curry(fn.bind(null,...args))
       }
   })

}

function curry2<T extends (...args:any[])=> any>(fn:T){
    return function curried (...args:any[]){
        if(args.length >= fn.length){
            return fn(...args)
        }
        return (...next: any[]) => curried(...args, ...next)

    }

}