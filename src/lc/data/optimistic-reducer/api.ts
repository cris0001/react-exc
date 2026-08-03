import type {Post} from "./postsReducer"

// Warstwa API — osobno, żeby dało się ją zamockować w testach.
// Celowo zawodzi ~30% czasu, żeby dało się zobaczyć rollback w akcji.

const FAILURE_RATE = 0.3

function maybeFail() {
    if (Math.random() < FAILURE_RATE) {
        throw new Error("Serwer odrzucił żądanie")
    }
}

export async function fetchPosts(): Promise<Post[]> {
    await new Promise((r) => setTimeout(r, 400))

    return [
        {id: 1, title: "Wprowadzenie do Reacta", likes: 12},
        {id: 2, title: "Hooki od środka", likes: 34},
        {id: 3, title: "Testowanie komponentów", likes: 8},
        {id: 4, title: "Wydajność i re-rendery", likes: 21},
    ]
}

export async function likePost(id: number): Promise<{ likes: number }> {
    await new Promise((r) => setTimeout(r, 600))
    maybeFail()
    return {likes: 0}   // serwer zwróciłby prawdziwą wartość
}

export async function deletePost(id: number): Promise<void> {
    await new Promise((r) => setTimeout(r, 600))
    maybeFail()
}
