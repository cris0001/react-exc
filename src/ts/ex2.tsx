import {useEffect, useRef, useState} from "react";

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


type ApiState<T> =
    | { variant: 'idle' }
    | { variant: 'loading'; message: string }
    | { variant: 'success'; data: T }
    | { variant: 'error'; message: string }



interface Props{
    users: User[],
    onDelete: (id: number) => void,
    isLoading?:boolean
}


const UserList = ({users,onDelete,isLoading}:Props)=>{

    const[selectedId, setSelectedId] = useState<number|null>(null)
    const ref= useRef<HTMLUListElement>(null)
    const onSelect=(e:React.MouseEvent<HTMLLIElement> )=>{
        console.log('zzz')
    }

    if(isLoading) return <p>Ładowanie...</p>
    if(users.length<1) return <p>Brak userów</p>
    return (
        <ul ref={ref}>
            {users.map(user => (
                <li key={user.id} onClick={onSelect}>
                    {user.name}
                    <button onClick={() => onDelete(user.id)}>Usuń</button>
                </li>
            ))}
        </ul>
    );
}

//  hook useApi<T> który:
//
// Przyjmuje url: string
// Zwraca ApiState<T> — użyj tego co pisałeś wcześniej
// Fetchuje dane przy montowaniu
// Obsługuje loading, success i error
// Używa AbortController do cleanup

function useApi<T>(url: string): ApiState<T> {
    const [state, setState] = useState<ApiState<T>>({ variant: 'idle' });

    useEffect(() => {
        const controller = new AbortController();

        setState({ variant: 'loading', message: 'Ładowanie...' });

        fetch(url, { signal: controller.signal })
            .then(r => {
                if (!r.ok) throw new Error(`HTTP error: ${r.status}`);
                return r.json();
            })
            .then((data: T) => setState({ variant: 'success', data }))
            .catch(err => {
                if (err.name === 'AbortError') return; // ignoruj anulowane
                setState({ variant: 'error', message: err.message });
            });

        return () => controller.abort();
    }, [url]);

    return state;
}


