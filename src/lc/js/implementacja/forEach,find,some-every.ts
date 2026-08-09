function myForEach<T>(arr: T[], cb: (el: T, i: number, arr: T[]) => void): void {
    for (let i = 0; i < arr.length; i++) {
        cb(arr[i], i, arr)
    }
}



// Jeden generyk. Callback zwraca void (nie używamy wyniku). Cała funkcja zwraca void.


function myFind<T>(arr: T[], cb: (el: T, i: number, arr: T[]) => boolean): T | undefined {
    for (let i = 0; i < arr.length; i++) {
        if (cb(arr[i], i, arr)) return arr[i]
    }
    return undefined
}


// Zwraca T | undefined — element albo undefined (gdy nic nie znaleziono). To ważne w typach: musisz obsłużyć przypadek undefined.


function mySome<T>(arr: T[], cb: (el: T, i: number, arr: T[]) => boolean): boolean {
    for (let i = 0; i < arr.length; i++) {
        if (cb(arr[i], i, arr)) return true
    }
    return false
}

function myEvery<T>(arr: T[], cb: (el: T, i: number, arr: T[]) => boolean): boolean {
    for (let i = 0; i < arr.length; i++) {
        if (!cb(arr[i], i, arr)) return false
    }
    return true
}


// Zwracają boolean. Jeden generyk T.