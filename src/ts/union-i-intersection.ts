// Typ ID — może być string lub number
type ID = string | number

// Discriminated union Shape:
//
// circle z polem radius
// rectangle z polami width i height
// triangle z polem base i height

type Shape =
    | { kind: 'circle';  radius:number }
    | { kind: 'rectangle';  width:number, height:number }
    | { kind: 'triangle'; base:number, height:number }

//Funkcję getArea która przyjmuje Shape i zwraca pole powierzchni


function getArea(k:Shape):number{

    if (k.kind === 'circle') return Math.PI * k.radius ** 2;
    if (k.kind === 'rectangle') return k.width * k.height;
    return (k.base * k.height) / 2;

}


//Typ AdminUser — intersection User z { permissions: string[], createdAt: Date }


type AdminUser = User & { permissions: string[], createdAt: Date }