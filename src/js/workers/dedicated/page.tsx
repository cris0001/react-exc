'use client'

import { useState } from "react";

const Page = () => {
    const [result, setResult] = useState<number | null>(null);

    function calculate() {
        const worker = new Worker(new URL('./dedicated.ts', import.meta.url));

        worker.postMessage([1, 2, 3, 4, 5,6,7,8,9,10]);

        worker.onmessage = (e: MessageEvent<number>) => {
            setResult(e.data);
            console.log(e.data); // ← e.data nie result! result jest stale closure
            worker.terminate();
        };
    }

    return (
        <>
            <button onClick={calculate}>Oblicz</button>
            <p>{result}</p>
        </>
    );
}

export default Page;