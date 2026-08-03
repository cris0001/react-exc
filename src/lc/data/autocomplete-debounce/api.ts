export function searchApi(query: string): Promise<string[]> {
    const db = ["react", "redux", "react-query", "vue", "svelte", "angular", "next.js", "remix", "astro", "solid"]
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(db.filter(item => item.includes(query.toLowerCase())))
        }, 300 + Math.random() * 500)  // zmienne opóźnienie — tu żyją race conditions
    })
}
