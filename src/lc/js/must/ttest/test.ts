
type NestedArrayy<T> = (T | NestedArray<T>) []




function flatten<T>(arr:NestedArrayy<T>){

    const result: Array<T> = []

    for(const el of arr){
        if(!Array.isArray(el)) result.push(el)
    else result.push(...flatten(el))
    }

    return result
}





function flatten2<T>(arr:NestedArrayy<T>):T[] {


  return   arr.reduce<T[]>((acc,el)=>{

        if(!Array.isArray(el)) acc.push(el)
        else acc.push(...flatten2(el))



        return acc
    },[])

}

function flatten3<T>(arr: NestedArrayy<T>): T[] {
    return arr.reduce<T[]>((acc, el) =>
            Array.isArray(el)
                ? [...acc, ...flatten3(el)]   // array → rozpakuj acc + spłaszczoną
                : [...acc, el],               // element → acc + el
        []
    )
}