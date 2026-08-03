// Typ RequestState<T> — discriminated union z wariantami:
//
//     idle
// loading
// success z data: T
// error z message: string i code: number


type RequestState<T> =
    | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'success'; data: T }
    | { status: 'error'; message: string; code: number }



// Funkcję renderState która przyjmuje RequestState<User[]> i zwraca string:
//
//     idle → 'Kliknij aby załadować'
// loading → 'Ładowanie...'
// success → 'Załadowano X userów'
// error → 'Błąd X: message'


function renderState(x: RequestState<User[]>):string{

    if(x.status==='idle') return 'Klinij aby załadować'
    if(x.status==='loading') return 'Ładowanie...'
    if (x.status === 'success') return `Załadowano ${x.data.length} userów`;
    else return `Błąd ${x.code}: ${x.message}`;

}

function renderState2(x: RequestState<User[]>): string {
    switch (x.status) {
        case 'idle':
            return 'Kliknij aby załadować';
        case 'loading':
            return 'Ładowanie...';
        case 'success':
            return `Załadowano ${x.data.length} userów`; // x.data dostępne ✅
        case 'error':
            return `Błąd ${x.code}: ${x.message}`; // x.code i x.message dostępne ✅
        default:
            const exhaustive: never = x; // TS błąd jeśli dodasz nowy wariant i zapomnisz obsłużyć ✅
            return exhaustive;
    }
}


// Napisz discriminated union dla akcji w reducerze:

// Typ CartAction:
type CartAction =
    | { type: 'ADD_ITEM'; product: Product; quantity: number }
    | { type: 'REMOVE_ITEM'; id: number }
    | { type: 'UPDATE_QUANTITY'; id: number; quantity: number }
    | { type: 'CLEAR_CART' }

// ADD_ITEM z product: Product i quantity: number
// REMOVE_ITEM z id: number
// UPDATE_QUANTITY z id: number i quantity: number
// CLEAR_CART


// Typ CartState z polami items: Product[] i total: number
type CartState = {
    items: Product[];
    total: number;
}

// Funkcję cartReducer która przyjmuje CartState i CartAction i zwraca CartState — użyj switch z never trickiem

function cartReducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {
        case 'ADD_ITEM':
            return {
                items: [...state.items, action.product], // action.product: Product
                total: state.total + action.product.price * action.quantity
            };

        case 'REMOVE_ITEM':
            return {
                items: state.items.filter(item => item.id !== action.id), // action.id: number
                total: state.items
                    .filter(item => item.id !== action.id)
                    .reduce((sum, item) => sum + item.price, 0)
            };

        case 'UPDATE_QUANTITY':
            return {
                ...state,
                items: state.items.map(item =>
                    item.id === action.id // action.id: number
                        ? { ...item, quantity: action.quantity } // action.quantity: number
                        : item
                ),
                total: state.total
            };

        case 'CLEAR_CART':
            return { items: [], total: 0 };

        default:
            const exhaustive: never = action; // TS błąd jeśli dodasz nowy case i zapomnisz
            return exhaustive;
    }
}