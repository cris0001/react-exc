import type { User }from './page.tsx'
import {useState} from "react";


const PAGE_SIZE= 10

export function UserList({users}:{users:User[]}){
    const [role, setRole] = useState('all')
    const [search, setSearch] = useState('')
    const [sorted, setSorted] = useState<{col:keyof User,dir:'asc'|'desc'}| null>(null)

    const [page, setPage] = useState(1)

    const byRole = users.filter(u => role === "all" || u.role === role)
    const filtered = byRole.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    )


    const sortedList = sorted
        ? [...filtered].sort((a, b) => {
            const dir = sorted.dir === "asc" ? 1 : -1
            const av = a[sorted.col]
            const bv = b[sorted.col]

            if (typeof av === "string" && typeof bv === "string") {
                return av.localeCompare(bv) * dir
            }
            if (typeof av === "number" && typeof bv === "number") {
                return (av - bv) * dir
            }
            if (typeof av === "boolean" && typeof bv === "boolean") {
                return (Number(av) - Number(bv)) * dir
            }
            return 0
        })
        : filtered


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
    const handleSortCol = (col:keyof User)=> {
        setPage(1)
        setSorted((prev)=>{
            if(!prev || prev.col !==col) return {col,dir:'asc'}

            return{col, dir: prev.dir ==='asc'? 'desc':'asc'}
        })
    }


    const totalPages = Math.ceil(sortedList.length / PAGE_SIZE)
    const totalElements = sortedList.length
    const start = (page - 1) * PAGE_SIZE
    const paginated = sortedList.slice(start, start + PAGE_SIZE)
    const pages = Array.from({length:totalPages}, (_,i)=> i +1)



    return (
        <div className="p-6 max-w-4xl mx-auto">

<select className={'border border-gray-200 rounded px-2 py-1'} value={role}  onChange={(e)=> {
    setRole(e.target.value)
    setPage(1)
}}>
    <option value={'all'} >all</option>
    <option value={'admin'} >admin</option>
    <option value={'user'} >user</option>
    <option value={'editor'} >editor</option>
</select>

            {/*🔺🔻*/}

            <input className={'border border-gray-200 rounded px-2 py-1'} value={search} onChange={(e)=>{
                setSearch(e.target.value)
                setPage(1)
            }} />
            <table className="w-full border-collapse text-sm">
                <thead>
                <tr className="border-b-2 border-gray-300 text-left">
                    <th onClick={()=> handleSortCol('name')} className="p-2 cursor-pointer select-none ">Imię
                        {sorted?.col === "name" ? (sorted.dir === "asc" ? "▲" : "▼") : ""}
                    </th>
                    <th onClick={()=> handleSortCol('email')} className="p-2 cursor-pointer select-none">Email
                        {sorted?.col === "email" ? (sorted.dir === "asc" ? "▲" : "▼") : ""}</th>
                    <th onClick={()=> handleSortCol('age')} className="p-2 cursor-pointer select-none">Wiek
                        {sorted?.col === "age" ? (sorted.dir === "asc" ? "▲" : "▼") : ""}</th>
                    <th onClick={()=> handleSortCol('role')} className="p-2 cursor-pointer select-none">Rola
                        {sorted?.col === "role" ? (sorted.dir === "asc" ? "▲" : "▼") : ""}</th>
                    <th onClick={()=> handleSortCol('active')} className="p-2 cursor-pointer select-none">Status
                        {sorted?.col === "active" ? (sorted.dir === "asc" ? "▲" : "▼") : ""}</th>
                </tr>
                </thead>
                <tbody>
                {paginated.map((u) => (
                    <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-2">{u.name}</td>
                        <td className="p-2 text-gray-600">{u.email}</td>
                        <td className="p-2">{u.age}</td>
                        <td className="p-2">{u.role}</td>
                        <td className="p-2">
                            {u.active
                                ? <span className="text-green-600">aktywny</span>
                                : <span className="text-gray-400">nieaktywny</span>}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <span>{start + paginated.length} z {totalElements}</span><div className={'flex justify-end gap-2'}>            {pages.map((el)=> <button onClick={()=> setPage(el)} className={`border border-gray-200 p-2  ${page === el?'bg-gray-200':''}`} key={el}>{el}</button>)}
</div>
        </div>
    )

}