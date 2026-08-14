function deepClone<T>(value: T): T {
    // 1. prymitywy i null — zwróć wprost (nie ma co klonować)
    if (value === null || typeof value !== 'object') {
        return value
    }

    // 2. tablica — sklonuj każdy element rekurencyjnie
    if (Array.isArray(value)) {
        return value.map((el) => deepClone(el)) as T
    }

    // 3. Date — nowy obiekt Date
    if (value instanceof Date) {
        return new Date(value.getTime()) as T
    }

//     Object.entries({ a: 1, b: 2 })
// // [['a', 1], ['b', 2]]


    // 4. obiekt — sklonuj każdą wartość rekurencyjnie
    const result: Record<string, unknown> = {}
    for (const [key, val] of Object.entries(value)) {
        result[key] = deepClone(val)
    }
    return result as T
}


function deepClone2<T>(value: T): T {

    if(value === null||  typeof value !== 'object'){
        return value
    }

    if(Array.isArray(value)){
        return value.map((el)=> deepClone2(el)) as T
    }


    if(value instanceof Date){
        return new Date(value.getTime()) as T
    }


    const result: Record<string, unknown>= {}
    for(const [key,val ] of Object.entries(value)){
        result[key]= deepClone2(val)
    }

    return result as T
}