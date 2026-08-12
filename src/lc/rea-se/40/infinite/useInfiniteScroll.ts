import {useEffect, useRef, useState} from "react";


type UseInfiniteScrollResult<T>={
    items:T[],
    loading:boolean,
    error:string,
    hasMore:boolean,
    sentinelRef: React.RefObject<HTMLDivElement | null>

}


export function useInfiniteScroll<T>(
    fetchPage: (page: number) => Promise<T[]>,
    limit: number
): UseInfiniteScrollResult<T>{


    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [items, setItems] = useState<T[]>([])
    const [hasMore,setHasMore] = useState(true)
    const [page,setPage ] = useState(1)


    const pageRef= useRef(1)
    const loadingRef= useRef(false)
    const hasMoreRef = useRef(true)

    const sentinelRef = useRef<HTMLDivElement>(null)


    const loadMore = async ()=>{
        if(loadingRef.current || !hasMoreRef.current) return

        loadingRef.current=true

        try{
            setLoading(true)
            setError('')

            const res = await fetchPage(pageRef.current)

            setItems((prev)=> [...prev,...res])

            pageRef.current += 1
            setPage(pageRef.current)

            if (res.length < limit) {
                hasMoreRef.current = false
                setHasMore(false)
            }
        }catch(err){
            setError(err instanceof Error ? err.message : 'error')

        }finally {
            setLoading(false)
            loadingRef.current = false

        }

    }

    useEffect(() => {
        const sentinel = sentinelRef.current

            if(!sentinel) return


        const observer = new IntersectionObserver((entries)=>{
            if(entries[0].isIntersecting) loadMore()
        })

        observer.observe(sentinel)


        return () => observer.disconnect()

    }, [hasMore]);



    useEffect(() => {
        loadMore()
    }, []);




    return { items, loading, error, hasMore, sentinelRef }
}