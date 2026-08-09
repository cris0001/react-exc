function debounce<T extends (...args:any[])=>void>(fn:T, ms:number){
    let timerId: ReturnType<typeof setTimeout>

    return ((...args:Parameters<T>)=>{
        clearTimeout(timerId)
        timerId = setTimeout(() => fn(...args), ms)
    })

}


