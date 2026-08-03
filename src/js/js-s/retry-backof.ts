async function retry<T>(
    fn: () => Promise<T>,
    retries: number,
    delay: number
): Promise<T> {
    try {
        return await fn()                          // spróbuj
    } catch (err) {
        if (retries === 0) throw err               // brak prób → poddaj się
        await new Promise(r => setTimeout(r, delay))   // poczekaj
        return retry(fn, retries - 1, delay * 2)   // ponów, podwój opóźnienie
    }
}

retry(() => fetch("/api").then(r => r.json()), 3, 1000)


// Sedno: rekurencja + try/catch + rosnące opóźnienie.
// Próbujesz fn; jak padnie i zostały próby — czekasz (setTimeout opakowany w promise = sleep),
// potem ponawiasz z mniejszą liczbą prób i podwojonym opóźnieniem (delay * 2 — to „backoff"). " +
// "Gdy próby się skończą — rzucasz błąd. Zamysł na ściągę: „try→sukces zwróć; catch→jak są próby,
// sleep i rekurencyjnie retry z delay×2; jak nie, throw.
// Backoff = podwajanie opóźnienia, żeby nie młócić padającego serwera".