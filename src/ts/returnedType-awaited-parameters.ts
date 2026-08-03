

function createProduct(name: string, price: number, category: 'electronics' | 'clothing') {
        return { id: Math.random(), name, price, category, createdAt: new Date() };
    }

async function fetchProduct(id: number): Promise<{ id: number, name: string }> {
    return { id, name: 'Product' };
}

//Typ Product — wyciągnij typ zwracany z createProduct

    type Productt = ReturnType<typeof createProduct>


    //Typ CreateProductParams — wyciągnij typy parametrów

type CreateProductParams= Parameters<typeof createProduct>


    //Typ FetchedProduct — wyciągnij typ po rozwiązaniu Promise z fetchProduct


type FetchedProduct= Awaited<ReturnType<typeof fetchProduct>>