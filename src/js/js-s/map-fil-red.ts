function myMap<T, U>(arr: T[], fn: (el: T, i: number) => U): U[]{
    const result: U[] = []
    for (let i = 0; i < arr.length; i++) {
        result.push(fn(arr[i],i))
    }
    return result
}

function myFilter<T>(arr:T[], fn:(el:T,i:number)=>boolean):T[]{

    const result: T[]=[]

    for(let i=0; i < arr.length; i++){
        if(fn(arr[i],i)) result.push(arr[i])
    }

    return result
}


function myReduce<T, U>(arr: T[], fn: (acc: U, el: T, i: number) => U, initial: U): U {
    let acc = initial                    // start
    for (let i = 0; i < arr.length; i++) {
        acc = fn(acc, arr[i], i)         // aktualizuj akumulator bieżącym elementem
    }
    return acc                            // zwrot jednej wartości
}