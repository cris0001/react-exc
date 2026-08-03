function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
}

// użycie:
// await sleep(1000)   // czeka 1s, potem leci dalej

// Sedno: setTimeout sam nie jest „awaitowalny" (bierze callback). Owijasz go w Promise," +
// " który resolvuje się po ms — dzięki temu możesz await sleep(ms). resolve jest callbackiem setTimeouta," +
// " więc po czasie promise się spełnia. Zamysł na ściągę: „opakowuję setTimeout w Promise," +
// " gdzie resolve odpala się po ms — zamienia callback na await".