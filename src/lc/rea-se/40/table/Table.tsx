import type {Bike} from "./page.tsx";
import {useState} from "react";

type TableProps={
    data:Bike[]
}


// export type Bike = {
//     id:number,
//     name:string,
//     brand:string,
//     type:'Szosowy'| 'Miejski'|'Gravel' |'Elektryczny'| 'MTB'
//     price:number,
//     inStock:boolean
// }


const PAGE_SIZE=10

export function Table({data}:TableProps){

    const [sorted, setSorted] = useState<{col:keyof Bike,dir:'asc'|'desc'}| null>(null)
    const [search, setSearch] = useState('')
    const [type, setType] = useState<Bike['type'] | 'all'>('all')
    const [page, setPage] = useState(1)


    const handleSetSort= (col:keyof Bike)=>{

        setSorted((prev)=>{
            if(!prev || prev.col !==col) return {col,dir:'asc'}
            if(prev.dir ==='desc') return null
            return{col, dir: prev.dir ==='asc'? 'desc':'asc'}
        })
    }



    const byType= data.filter(el=> type==='all'|| el.type===type)
const filtered = byType.filter(el=> el.name.toLowerCase().includes(search.toLowerCase()) ||  el.brand.toLowerCase().includes(search.toLowerCase()) )

    const sortedData = sorted? [...filtered].sort((a,b)=>{
        const dir = sorted.dir === 'asc'? 1: -1
        const av= a[sorted.col]
        const bv= b[sorted.col]

        if(typeof av ==='string' && typeof bv ==='string'){
            return av.localeCompare(bv) * dir
        }
        if (typeof av === "number" && typeof bv === "number") {
            return (av - bv) * dir
        }
        if (typeof av === "boolean" && typeof bv === "boolean") {
            return (Number(av) - Number(bv)) * dir
        }
        return 0


    }) : filtered





    // const sortedList = sorted
//     ? [...filtered].sort((a, b) => {
//         const dir = sorted.dir === "asc" ? 1 : -1
//         const av = a[sorted.col]
//         const bv = b[sorted.col]
//
//         if (av < bv) return -1 * dir
//         if (av > bv) return 1 * dir
//         return 0
//     })
//     : filtered

    const totalElements = sortedData.length
    const totalPages = Math.ceil(totalElements / PAGE_SIZE)
    const start = (page -1 )* PAGE_SIZE
    const paginated = sortedData.slice(start, start + PAGE_SIZE)
    const pages = Array.from({length:totalPages}, (_,i)=> i + 1)

    const showed = page===1? paginated.length : ((page-1) * PAGE_SIZE)+ paginated.length

    return(
        <>
            <div>
                <input className={'border rounded px-2 py-1 border-gray-200 my-4'} value={search}
                       onChange={(e) => {
                           setSearch(e.target.value)
                           setPage(1)
                       }}/>
                <select className={'border rounded px-2 py-1 border-gray-200 my-4'} value={type}
                        onChange={(e) => {
                            setType(e.target.value as Bike['type'] | 'all')
                            setPage(1)
                        }}>
                    <option value={'all'}>all</option>
                    <option value={'Szosowy'}>Szosowy</option>
                    <option value={'Miejski'}>Miejski</option>
                    <option value={'Gravel'}>Gravel</option>
                    <option value={'MTB'}>MTB</option>


                </select>

                <table className="border-collapse">
                    <thead>
                    <tr>
                        <th onClick={() => handleSetSort('name')}
                            className="border border-gray-300 px-3 py-1.5 text-left">
                            name {sorted?.col === 'name' ? sorted.dir === 'asc' ? "🔽" : "🔼" : ""}
                        </th>
                        <th onClick={() => handleSetSort('brand')}
                            className="border border-gray-300 px-3 py-1.5 text-left">
                            brand {sorted?.col === 'brand' ? sorted.dir === 'asc' ? "🔽" : "🔼" : ""}
                        </th>
                        <th onClick={() => handleSetSort('type')}
                            className="border border-gray-300 px-3 py-1.5 text-left">
                            type {sorted?.col === 'type' ? sorted.dir === 'asc' ? "🔽" : "🔼" : ""}
                        </th>
                        <th onClick={() => handleSetSort('price')}
                            className="border border-gray-300 px-3 py-1.5 text-left">
                            price {sorted?.col === 'price' ? sorted.dir === 'asc' ? "🔽" : "🔼" : ""}
                        </th>
                        <th onClick={() => handleSetSort('inStock')}
                            className="border border-gray-300 px-3 py-1.5 text-left">
                            in stock {sorted?.col === 'inStock' ? sorted.dir === 'asc' ? "🔽" : "🔼" : ""}
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {paginated.map((bike) => (
                        <tr key={bike.id}>
                            <td className="border border-gray-300 px-3 py-1.5">{bike.name}</td>
                            <td className="border border-gray-300 px-3 py-1.5">{bike.brand}</td>
                            <td className="border border-gray-300 px-3 py-1.5">{bike.type}</td>
                            <td className="border border-gray-300 px-3 py-1.5">{bike.price}</td>
                            <td className="border border-gray-300 px-3 py-1.5">
                                {bike.inStock ? "tak" : "nie"}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <button disabled={page===1} className={`p-2 border px-1 border-blue-300 rounded `}
                        onClick={() => setPage(page - 1)}>prev
                </button>
                {pages.map((el) => <button
                    className={`p-2 border px-1 border-blue-300 rounded ${page === el ? 'bg-blue-300' : ''}`}
                    onClick={() => setPage(el)} key={el}>{el}</button>)}
                <button disabled={page===totalPages} className={`p-2 border px-1 border-blue-300 rounded `}
                        onClick={() => setPage(page  +1)}>next
                </button>
            </div>
            {showed} / {totalElements}
        </>
    )
}