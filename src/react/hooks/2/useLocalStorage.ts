import {useEffect, useState} from "react";

function useLocalStorage<T>(key:string,initialValue:T){

    const [value, setValue] = useState(()=>{
        const actualValue = window.localStorage.getItem(key)
        if(actualValue){
            try{
                const val = JSON.parse(actualValue)
                return val
            }catch (err){
                return initialValue
            }
        }

        return initialValue
    })


    useEffect(() => {
        window.localStorage.setItem(key, JSON.stringify(value))
    }, [value,key]);



    return[value,setValue]as const


}


function useLocalStorage2<T>(key: string, initialValue: T) {
    const [value, setValue] = useState<T>(() => {
        const stored = window.localStorage.getItem(key)
        if (stored) {
            try {
                return JSON.parse(stored)
            } catch {
                return initialValue
            }
        }
        return initialValue
    })

    // Zapis do storage przy każdej zmianie value.
    useEffect(() => {
        window.localStorage.setItem(key, JSON.stringify(value))
    }, [key, value])

    // Synchronizacja MIĘDZY KARTAMI.
    // Event 'storage' odpala się w INNYCH kartach, gdy ta karta zmieni localStorage.
    // (w karcie, która zapisała, event się NIE odpala — stąd potrzeba efektu wyżej)
    useEffect(() => {
        const handleStorage = (e: StorageEvent) => {
            // reaguj tylko na nasz klucz i tylko gdy jest nowa wartość
            if (e.key === key && e.newValue !== null) {
                try {
                    setValue(JSON.parse(e.newValue))
                } catch {
                    // zepsute dane w evencie — ignoruj
                }
            }
        }

        window.addEventListener("storage", handleStorage)
        return () => window.removeEventListener("storage", handleStorage)
    }, [key])

    return [value, setValue] as const
}
