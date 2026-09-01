import {useState} from "react";
import {useDebounce} from "@/lc/rea-se/40/autocmplt-2/use-debounce.ts";
import {useFetch} from "@/lc/rea-se/40/autocmplt-2/use-fetch.ts";

export function Autocomplete2(){

    const [search, setSearch] = useState('')

    const debounced = useDebounce(search,666)

    const {data,loading, error} = useFetch(debounced)

        console.log(data.length)
        console.log(loading)

    const showEmpty = !loading && !error && data.length === 0
    const showData = !loading && !error && data.length > 0

    return(
        <div className={'flex flex-col p-8'}>
            <input className={'border border-gray-200 px-4 rounded'} value={search} onChange={(e)=> setSearch(e.target.value)} />

            {loading && <span>loading</span>}
            {error && !loading &&<span className={'text-red-300'} >{error}</span>}
            {showEmpty && <span>brak danych</span>}
            {showData && <ul className={'h-[233px] overflow-y-auto'}>
                {data.map((el)=> <li className={'border-gray-200 bg-gray-50 mb-0.5 border rounded'} key={el}>{el}</li>)}
            </ul>}

        </div>
    )
}