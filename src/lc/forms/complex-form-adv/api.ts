import type {TicketFormValues} from "./schema"

// Błąd, który dotyczy KONKRETNEGO POLA — serwer mówi, które pole jest złe.
// To coś innego niż ogólny "coś poszło nie tak": taki błąd powinien
// wylądować przy inpucie, nie w banerze na górze.
export class FieldError extends Error {
    constructor(
        public field: string,
        message: string,
    ) {
        super(message)
        this.name = "FieldError"
    }
}

export async function createTicket(ticket: TicketFormValues): Promise<{id: number}> {
    await new Promise((r) => setTimeout(r, 600))

    // symulacja walidacji po stronie serwera — front nie mógł tego sprawdzić,
    // bo tylko backend wie, jakie tytuły już istnieją
    if (ticket.title.trim().toLowerCase() === "duplikat") {
        throw new FieldError("title", "Zgłoszenie o takim tytule już istnieje")
    }

    if (ticket.title.trim().toLowerCase() === "błąd") {
        throw new Error("Serwer niedostępny")
    }

    return {id: Math.floor(Math.random() * 10000)}
}
