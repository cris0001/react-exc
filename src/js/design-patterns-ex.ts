
interface NotificationP{
    send:(message:string)=> void
}


class EmailProvider implements NotificationP{

    send(message:string){
      console.log(message)
    }
}

class PhoneProvider implements NotificationP{

    send(message:string){
        console.log(message)
    }
}


function createNotification(type: 'email'|'phone'){

    switch (type){
        case 'email': return new EmailProvider()
        case 'phone': return new PhoneProvider()
        default:
            throw new Error('xd')
    }


}



// sortProducts(products, strategy)


type Prodd={
    price:number,
    name:string
}

const sortStrategiess = {
    byPrice: (a:Prod, b:Prod) => a.price - b.price,
    byName: (a:Prod, b:Prod) => a.name.localeCompare(b.name),
};


function sortProductss(products:Prod[], strategy:keyof typeof sortStrategies){
    return products.sort(sortStrategies[strategy])
}




function withLogging<T extends (...args:any[])=> any>(fn:T){

   return( (...args:any[])  =>{
       console.log(args)
       const result =  fn(...args)
       console.log(result)
return result
   })

}



class Configg{

    private static instance:Configg

   static getInstance(){
        if(!Configg.instance) Configg.instance = new Configg()
        return Configg.instance

    }

}


type Fnc = (data: any) => void

class EventEmitttter{

    listeners = new Map<string,Fnc[]>()


    on(event:string, fn:Fnc){
        const fns = this.listeners.get(event) ?? []
        fns.push(fn)
        this.listeners.set(event, fns)
    }

    off(event:string, fn:Fnc){
        const fns = this.listeners.get(event)
        if(fns){
            this.listeners.set(event, fns.filter((el)=> el !==fn))
        }

    }

    emit(event:string, data:any){
        (this.listeners.get(event)?.forEach((el)=> el(data)))
    }

}


const sortStrateg={
    byName:((a:any,b:any)=> a.name.localeCompare(b.name)),
    byId:((a:any,b:any)=> a.id-b.id)
}


function sortProd(data:any[], strategy: keyof typeof sortStrateg){

    return data.sort(sortStrateg[strategy])
}



function withRetry<T extends (...args:any[])=> any>(fn:T, retry:number){

    return(async (...args:any[])=>{
        let result
        for(let i=0; i < retry; i ++){
           try{
               result= await fn(...args)
               return result
           }catch{
                if(i===retry-1) throw new Error('xd')
           }
        }
    })
}





const cartt = (()=>{
    let items: any[] = [] // prywatne

    return {
        add: (item: any) => items.push(item),
        get: () => items,
        clear: () => { items = [] }
    }
})()






