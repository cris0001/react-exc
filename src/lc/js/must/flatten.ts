type NestedArray<T> = (T | NestedArray<T>)[]

function flatten<T>(arr: NestedArray<T>): T[] {
    const result: T[] = []

    for (const el of arr) {
        if (Array.isArray(el)) {
            result.push(...flatten(el))   // tablica → spłaszcz rekurencyjnie
        } else {
            result.push(el)                // element prosty → dodaj
        }
    }

    return result
}