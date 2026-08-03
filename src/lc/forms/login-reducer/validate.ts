// Czysta logika walidacji — zero Reacta.
// Wydzielona, bo: łatwo testowalna, reużywalna, komponent zostaje z UI.

export type FormValues = {
    email: string
    password: string
}

// Partial<> bo błąd może wystąpić tylko przy niektórych polach (albo żadnym)
export type FormErrors = Partial<Record<keyof FormValues, string>>

export function validate(values: FormValues): FormErrors {
    const errors: FormErrors = {}

    // .trim() — same spacje to nie jest wypełnione pole
    if (!values.email.trim()) {
        errors.email = "Email jest wymagany"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        // prosty regex: coś@coś.coś bez spacji — łapie literówki.
        // Prawdziwa weryfikacja emaila = mail z linkiem potwierdzającym.
        errors.email = "Nieprawidłowy format email"
    }

    if (!values.password) {
        errors.password = "Hasło jest wymagane"
    } else if (values.password.length < 8) {
        errors.password = "Hasło musi mieć min. 8 znaków"
    }

    return errors
}