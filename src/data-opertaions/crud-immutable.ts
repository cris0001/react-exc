export type Product = { id: string; name: string; price: number; active: boolean }


const products: Product[] = [
    { id: "a", name: "Mysz", price: 50, active: true },
    { id: "b", name: "Klawiatura", price: 120, active: false },
    { id: "c", name: "Monitor", price: 800, active: true },
]

//Funkcje do napisania — wszystkie immutable (wchodzi tablica, wychodzi nowa):

// addProduct(list: Product[], product: Product): Product[]
// removeProduct(list: Product[], id: string): Product[]
// updatePrice(list: Product[], id: string, price: number): Product[]
// toggleActive(list: Product[], id: string): Product[]


function addProduct(list: Product[], product: Product):Product[]{
    const newArr:Product[]= [...list,product]
    return newArr
}

function removeProduct (list: Product[], id: string): Product[]{
    return list.filter((el)=> el.id !== id)
}

function updatePrice(list: Product[], id: string, price: number): Product[]{
    return list.map((prod)=> prod.id === id ?  {...prod, price}: prod)
}

function toggleActive(list: Product[], id: string): Product[]{
    return list.map((el)=> el.id === id ? {...el, active: !el.active}: el)
}


// Plus trzy selektory (czyste, liczą z listy):

// countActive(list: Product[]): number
// totalActivePrice(list: Product[]): number   // suma cen tylko aktywnych
// findById(list: Product[], id: string): Product | undefined





function countActive(list:Product[]):number{

    return list.filter((el)=> el.active).length
}


function totalActivePrice(list: Product[]): number{

    const sum = list.reduce((acc, item)=>{
       if(item.active) acc = acc + item.price
        return acc
    },0)

    return sum
}



function findById(list: Product[], id: string): Product | undefined{

    return list.find(el => el.id === id)
}











