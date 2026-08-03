import type {User} from './page.tsx'
import {memo, useMemo, useState} from "react";


type UserListProps={
    data:User[]
    handleToggle: (id:User['id'])=>void
}



export function UserList({data,handleToggle}:UserListProps){

    const [search, setSearch] = useState('')

    // const filtered = useMemo(() =>
    //         data.filter(el =>
    //             el.name.toLowerCase().includes(search.toLowerCase()) ||
    //             el.email.toLowerCase().includes(search.toLowerCase())
    //         ),
    //     [data, search]
    // );


    const filtered = data.filter(el =>
            el.name.toLowerCase().includes(search.toLowerCase()) ||
            el.email.toLowerCase().includes(search.toLowerCase())
        )
    const activeCount = data.filter(u => u.active).length



    return(
        <div className={'px-2'}>
            <input className={'border border-gray-500 rounded px-2 mb-6 mt-2'} value={search}
                   onChange={(e) => setSearch((e.target.value))}/>
            {filtered.length === 0 && <p>Brak wyników</p>}
            <p>Aktywni: {activeCount} / {data.length}</p>
            <ul>
                {filtered.map((el) => <UserRow key={el.id} user={el} handleToggle={handleToggle}/>)}
            </ul>


        </div>
    )
}



const UserRow  = memo(function UserRow({ user, handleToggle }:{user:User,handleToggle:(id:User['id'])=>void}) {
    console.log(`render row-${user.id}`)
    return <li
               className={'border border-gray-200 px-2 py-1 rounded mt-1 flex flex-col'}>
        <p>{user.name}</p> <p>{user.email}</p>
        <p>{user.active ? 'aktywny' : 'niekatywny'}</p>
        <button onClick={() => handleToggle(user.id)}>toggle</button>
    </li>;
})