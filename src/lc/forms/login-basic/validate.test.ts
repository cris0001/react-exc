import {describe, it, expect} from "vitest"
import {validate} from "./validate"

// ============================================================
// UNIT TESTY — czysta funkcja, zero Reacta.
// Pokrycie: każda gałąź + wartości graniczne + edge case'y.
// ============================================================

describe("validate", () => {

    // ---------- HAPPY PATH ----------
    it("nie zwraca błędów dla poprawnych danych", () => {
        const errors = validate({email: "test@test.pl", password: "haslo123"})
        expect(errors).toEqual({})   // toEqual — porównanie głębokie (obiekt)
    })

    // ---------- EMAIL ----------
    it("zwraca błąd, gdy email jest pusty", () => {
        const errors = validate({email: "", password: "haslo123"})
        expect(errors.email).toBe("Email jest wymagany")
    })

    it("traktuje same spacje jako pusty email", () => {
        // sprawdza, czy .trim() faktycznie działa
        const errors = validate({email: "   ", password: "haslo123"})
        expect(errors.email).toBe("Email jest wymagany")
    })

    it("zwraca błąd, gdy email nie ma @", () => {
        const errors = validate({email: "niepoprawny", password: "haslo123"})
        expect(errors.email).toBe("Nieprawidłowy format email")
    })

    it("zwraca błąd, gdy email nie ma domeny z kropką", () => {
        // "jan@gmail" bez .com — typowa literówka
        const errors = validate({email: "jan@gmail", password: "haslo123"})
        expect(errors.email).toBe("Nieprawidłowy format email")
    })

    // ---------- PASSWORD ----------
    it("zwraca błąd, gdy hasło jest puste", () => {
        const errors = validate({email: "test@test.pl", password: ""})
        expect(errors.password).toBe("Hasło jest wymagane")
    })

    // --- WARTOŚCI GRANICZNE — najważniejsza para ---
    it("zwraca błąd, gdy hasło ma 7 znaków", () => {
        const errors = validate({email: "test@test.pl", password: "1234567"})
        expect(errors.password).toBe("Hasło musi mieć min. 8 znaków")
    })

    it("NIE zwraca błędu, gdy hasło ma dokładnie 8 znaków", () => {
        // granica! Tu wychodzi bug < vs <=
        const errors = validate({email: "test@test.pl", password: "12345678"})
        expect(errors.password).toBeUndefined()
    })

    // ---------- KOMBINACJE ----------
    it("zwraca oba błędy, gdy oba pola są niepoprawne", () => {
        const errors = validate({email: "zly", password: "krotkie"})
        expect(errors).toEqual({
            email: "Nieprawidłowy format email",
            password: "Hasło musi mieć min. 8 znaków",
        })
    })
})