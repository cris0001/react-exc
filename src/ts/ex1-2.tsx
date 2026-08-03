// napisz komponent DataView który:
// - przyjmuje props state: ApiState<T> (ten co pisałeś wcześniej)
// - i renderItem: (item: T) => React.ReactNode
// - renderuje odpowiedni UI dla każdego wariantu
// - przy success używa renderItem do wyrenderowania danych


type ApiState<T> =
    | { variant: 'idle' }
    | { variant: 'loading'; message: string }
    | { variant: 'success'; data: T }
    | { variant: 'error'; message: string }



interface Props<T>{
    state:ApiState<T>,
    renderItem: (item:T) => React.ReactNode
}


const DataView2 = <T,>({state,renderItem}:Props<T>)=>{

   switch(state.variant){
       case 'idle': return <p>zrob cos</p>
       case 'loading': return <p>loading</p>
       case 'error': return <p>{state.message}</p>
       case 'success': return <>{renderItem(state.data)}</>
       default:
           const def:never = state
           return def
   }
}

function DataView3<T>({ state, renderItem }: Props<T>) {
    switch (state.variant) {
        case 'idle':    return <p>zrob cos</p>;
        case 'loading': return <p>loading</p>;
        case 'error':   return <p>{state.message}</p>;
        case 'success': return <>{renderItem(state.data)}</>;
        default:
            const def: never = state;
            return def;
    }
}

interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user';
}

interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
}


// Napisz komponent Table<T> który:
//
// przyjmuje data: T[]
// przyjmuje columns: Column<T>[] gdzie Column<T> to typ który sam napiszesz
// Column<T> ma pola: key: keyof T, header: string, render?: (value: T[keyof T]) => React.ReactNode
// renderuje tabelę z nagłówkami i wierszami



interface TableProps<T>{
    data:T[],
    columns:Column<T>[]
}

type Column<T>={
    key: keyof T,
    header:string,
    render?:(value: T[keyof T])=> React.ReactNode
}


function Table<T>({data,columns}:TableProps<T>){

    return(
        <>
            <table>
                <thead>
                <tr>
                    {columns.map((el) => {
                        return <th key={el.key as string}>{el.header}</th>
                    })}
                </tr>
                </thead>
                <tbody>
                {data.map((item, i) => (
                    <tr key={i}>
                        {columns.map((col) => (
                            <td key={col.key as string}>
                                {col.render ? col.render(item[col.key]) : String(item[col.key])}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    )

}









