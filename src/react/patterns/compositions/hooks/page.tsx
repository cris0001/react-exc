'use client'

// useLocalStorage
import {useEffect, useState} from "react";

function useLocalStorage<T>(key: string, initial: T) {
    const [value, setValue] = useState<T>(() => {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : initial;
    });

    function set(val: T) {
        setValue(val);
        localStorage.setItem(key, JSON.stringify(val));
    }

    return [value, set] as const;
}

// useDebounce
function useDebounce<T>(value: T, delay: number) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debounced;
}




// użycie
function Search() {
    const [query, setQuery] = useState('');
    const debouncedQuery = useDebounce(query, 300);

    useEffect(() => {
        // fetchResults(debouncedQuery); // fetchuje dopiero 300ms po ostatnim keystroke
    }, [debouncedQuery]);
}