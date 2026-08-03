// Closures — createCounter
// Napisz funkcję createCounter(), która zwraca obiekt z metodami increment(), decrement(), get(). Licznik ma być prywatny — nie da się go zmienić inaczej niż przez te metody.
//
//     js
// const c = createCounter()
// c.increment()
// c.increment()
// c.get()  // 2


function createCounter(){

   let counter =0
    return {
        increment: ()=> counter ++,
        decrement: ()=> counter --,
        get: ()=> counter
    }

}



// 2. Transformacje — grupowanie
// Masz tablicę osób, pogrupuj po mieście:
//
//     js
// const people = [
//     { name: "Anna", city: "Warszawa" },
//     { name: "Piotr", city: "Kraków" },
//     { name: "Ewa", city: "Warszawa" },
// ]
// // wynik: { Warszawa: ["Anna", "Ewa"], Kraków: ["Piotr"] }

type Person = { name: string; city: string }


const people:Person[] = [
    { name: "Anna", city: "Warszawa" },
    { name: "Piotr", city: "Kraków" },
    { name: "Ewa", city: "Warszawa" },
]

function groupByCity(people: Person[]): Record<string, string[]> {
    return people.reduce((acc, person) => {
        if (!acc[person.city]) acc[person.city] = []
        acc[person.city].push(person.name)

        return acc
    }, {} as Record<string, string[]>)
}

function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
    let timer: ReturnType<typeof setTimeout> | undefined

    return ((...args: Parameters<T>) => {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => fn(...args), delay)
    }) as T
}