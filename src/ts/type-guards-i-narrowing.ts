// Napisz:
//
// Funkcję process która przyjmuje string | number | null i:
//
// jeśli null — zwraca 'brak wartości'
// jeśli string — zwraca string wielkimi literami
// jeśli number — zwraca liczbę zaokrągloną do 2 miejsc po przecinku


function proces(x:string | number| null){

if(x===null) return 'brak wartosci'
    if(typeof x === 'string') return x.toUpperCase()
    else return x.toFixed(2)

}


//Custom type guard isUser który sprawdza czy obiekt jest User (ma id i name)

function isUser(obj: unknown): obj is User {
    return typeof obj === 'object'
        && obj !== null
        && 'id' in obj
        && 'name' in obj;
}


// Funkcję makeSound która przyjmuje Dog | Cat i wywołuje odpowiednią metodę
// — bark() dla psa, meow() dla kota. Użyj instanceof.


class Dog{

    bark(){
        return 'hał hał'
    }
}

class Cat{

    meow(){
        return 'miał miał'
    }
}

function makeSound(animal: Dog|Cat){
    if(animal instanceof Dog) animal.bark()
    else animal.meow()
}