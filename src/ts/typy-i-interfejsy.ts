
// Interfejs Product z polami: id, name, price, category, inStock
interface Product{
    id:number,
    name:string,
    price:number,
    category:string,
    inStock:boolean
}
// Typ ProductPreview który zawiera tylko id i name z Product (użyj utility type)
type ProductPreview2=Pick<Product, 'id'|'name'>

//Typ ProductStatus — union z wartościami: 'available', 'out_of_stock', 'discontinued'
type ProductStatus = 'available'| 'out_of_stock'| 'discontinued'


// Typ AdminProduct który łączy Product z { createdBy: string, updatedAt: Date }
type AdminProduct = Product & { createdBy: string, updatedAt: Date }


//Interfejs ApiResponse<T> — generyczny, z polami data, status, message
interface ApiResponse<T> {
    data: T;           // T = typ danych, np. Product, Product[], User
    status: number;
    message: string;
}


//Interfejs Animal z polami name i age

interface Animal{
    name:string,
    age:number
}

//Interfejs Dog który rozszerza Animal o pole breed
interface Dog extends Animal{
    breed:string
}

//Interfejs ServiceDog który rozszerza Dog o pole task
interface ServiceDog extends Dog{
    task:string
}

//wywołaj funkcję która przyjmuje Animal i zwraca string z imieniem.
function describe(animal: Animal): string {
    return `${animal.name}-${animal.age}`
}

// powinna działać dla Animal, Dog i ServiceDog
describe({ name: 'Rex', age: 3 });
describe({ name: 'Rex', age: 3, breed: 'Labrador' } as Animal);
describe({ name: 'Rex', age: 3, breed: 'Labrador', task: 'guide' }  as Animal);