// Warstwa API — osobny plik, żeby dało się ZAMOCKOWAĆ w testach.
// Gdyby login siedziało w LoginForm.tsx, vi.mock nie miałby czego podmienić.

export async function login(email: string, password: string): Promise<void> {
    // symulacja opóźnienia sieci
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (email === "test@test.pl" && password === "haslo123") {
        return // sukces
    }

    throw new Error("Nieprawidłowy email lub hasło")
}