import {useEffect, useRef, useState} from "react";
import {fetchData} from "@/lc/rea-se/40/autocmplt-2/api.ts";

export function useFetch(query:string){

    const [data, setData] = useState<Array<string>>([])
    const [loading, setLoading] =useState(false)
    const [error, setError] = useState('')
    const [fetchedQuery, setFetchedQuery] = useState('')

    const cache = useRef(new Map<string, string[]>())

    useEffect(() => {

        if (!query.trim()) {
            setData([])
            setLoading(false)
            setError('')
            return
        }

        if (cache.current.has(query)) {
            setData(cache.current.get(query)!)
            setFetchedQuery(query)
            setLoading(false)
            setError('')
            return
        }

        setLoading(true)

        let ignore = false

        const handleFetch = async ()=> {

            setError('')

            try{
                const res = await fetchData(query)
                cache.current.set(query, res)
                if(!ignore) setData(res)

            }catch (err){
                if(!ignore) setError('wystapil blad')
            }finally {
                if (!ignore) {
                    setLoading(false)
                    setFetchedQuery(query)
                }
            }
        }

        handleFetch()
        return () => { ignore = true }
    }, [query]);


    return {data, loading, error, fetchedQuery }
}