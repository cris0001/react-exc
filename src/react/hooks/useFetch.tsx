import {useEffect, useState} from "react";

function useFetch<T>(url:string){

    const [data, setData] = useState<T | null>(null)
    const [loading, setLoading]= useState(false)
    const [error,setError] = useState('')

    useEffect(() => {
        const controller = new AbortController()

        const fetchData= async()=>{

            try{
                setLoading(true)
                setError('')
                const  res = await fetch(url,{ signal: controller.signal })
                if(!res.ok) throw new Error(`HTTP ${res.status}`)
                const json = await res.json()
                setData(json)
            }catch(err:unknown){
                if (err instanceof Error && err.name === 'AbortError') return
                setError('blad i chuj')
            } finally {
                if (!controller.signal.aborted) setLoading(false)
            }
        }
            fetchData()
        return () => controller.abort()
    }, [url]);


    return {data,loading, error}
}