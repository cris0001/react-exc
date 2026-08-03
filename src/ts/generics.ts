//Funkcję getFirst<T> która przyjmuje tablicę i zwraca pierwszy element

import {useState} from "react";

function getFirst<T>(arr:T[]):T{
    return arr[0]
}


//Funkcję getProperty<T, K> która przyjmuje obiekt i klucz i zwraca wartość pod tym kluczem (użyj constraint K extends keyof T)

function getProperty<T,K extends keyof T>(obj:T, key:K): T[K]{
    return obj[key]
}

//Interfejs Pair<T, U> z polami first i second różnych typów

interface Pair<T,U>{
    first:T,
    second:U
}

//Funkcję merge<T, U> która łączy dwa obiekty w jeden

function merge<T extends {},U extends {}>(obj1:T, obj2:U):T & U{
    return {...obj1, ...obj2}
}

//Napisz hook useLocalStorage<T> który:
//przyjmuje key: string i initialValue: T
//zwraca [T, (value: T) => void]

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
    const [value, setValue] = useState<T>(() => {
        // odczyt z localStorage przy inicjalizacji
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : initialValue;
    });

    function set(val: T) {
        setValue(val);
        localStorage.setItem(key, JSON.stringify(val)); // zapis przy zmianie
    }

    return [value, set];
}