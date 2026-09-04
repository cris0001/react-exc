// Uwaga do gramatyki: pisałeš po polsku, więc নক্ষcie poprawiam.
//
//     Dobra — od łatwych, stopniowo trudniej.
//
//     Zadanie 1 (łatwe) — napisz:
//
//     Napisz funkcję getUser(id), która fetchuje https://api.example.com/users/${id}, zwraca sparsowany JSON. Async/await. Sprawdź res.ok (rzuć błąd jak nie OK).
//
//     Napisz sam — kilka linii. Potem sprawdzę i pójdziemy w trudniejsze.



const getUser = async(id:number)=>{

    try{
        const res = await fetch(`https://api.example.com/users/${id}`)
        if (!res.ok) throw new Error('błąd pobierania')
        return res.json()
    }catch (err) {
        throw new Error(err instanceof Error ? err.message : 'coś poszło nie tak')
    }

}

//
// Napisz funkcję fetchAll(urls) — bierze tablicę URLi, fetchuje wszystkie równolegle, zwraca tablicę sparsowanych JSONów. Jak którykolwiek padnie → cała funkcja rzuca (fail-fast).
//
//     Async/await. Podpowiedź: Promise.all + map, sprawdź res.ok w każdym.
//
//     Napisz sam. Potem sprawdzę i pójdziemy w trudniejsze (np. allSettled — zebranie wyników mimo błędów).


const fetchAll =async(urls:Array<string>)=>{


    const result = await Promise.all( urls.map(url => fetch(url).then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
    })))

    return result
}


// Napisz fetchAllSettled(urls) — fetchuje wszystkie URLe, ale NIE fail-fast. Zwraca tablicę wyników, gdzie każdy to
// { ok: true, data } (sukces) albo { ok: false, error } (błąd). Czyli częściowe błędy nie wywalają całości — dostajesz co się udało + info o tym co padło.
//
//     Async/await. Podpowiedź: Promise.allSettled albo map z try/catch w środku.


const fetchAllSettled =async(urls:string[])=>{

    const results = Promise.allSettled(urls.map(url=> fetch(url).then(r=>{
        if(!r.ok) throw new Error('http')
        return r.json()
    })))

    return results

}


// Napisz fetchWithRetry(url, retries) — fetchuje URL, przy błędzie ponawia do retries razy (z 500ms przerwą między próbami). Jak wszystkie próby padną → rzuć ostatni błąd.
//
//     Async/await, pętla, try/catch, sleep (const sleep = ms => new Promise(r => setTimeout(r, ms))).
//
// Podpowiedź: pętla for po próbach, try/catch w środku (sukces → return, błąd → jak ostatnia próba throw, inaczej await sleep i próbuj dalej).



async function fetchWithRetry(url:string,retries:number){

    for (let i=1; i<= retries; i ++){
        try{
            const res = await fetch(url)
            if(!res.ok) throw new Error ('xd')
            return await res.json()
        }catch (err){
            if(i===retries) throw err
            await sleep(500)
        }
    }

}