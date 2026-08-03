export type Item = {
    id: number
    name: string
    email: string
}

// Generator danych — trzymany osobno, żeby dało się go użyć w testach
// i żeby komponenty nie miały w sobie logiki tworzenia danych.
export function generateItems(count: number): Item[] {
    return Array.from({length: count}, (_, i) => ({
        id: i,
        name: `Item ${i}`,
        email: `user${i}@example.com`,
    }))
}
