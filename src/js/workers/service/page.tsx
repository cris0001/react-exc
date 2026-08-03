// page.tsx
'use client';

import { useState, useEffect } from "react";
import {Message} from "../shared/shared-worker";

const worker = new SharedWorker(new URL('./shared-worker.ts', import.meta.url));

const Page = () => {
    const [cart, setCart] = useState<string[]>([]);

    useEffect(() => {
        worker.port.onmessage = (e: MessageEvent<string[]>) => {
            setCart(e.data);
        };
    }, []);

    function addItem(item: string) {
        worker.port.postMessage({ type: 'ADD', item } satisfies Message);
    }

    function getCart() {
        worker.port.postMessage({ type: 'GET' } satisfies Message);
    }

    return (
        <div>
            <button onClick={() => addItem('buty')}>Dodaj buty</button>
            <button onClick={() => addItem('kurtka')}>Dodaj kurtkę</button>
            <button onClick={getCart}>Pobierz koszyk</button>
            <p>{cart.join(', ')}</p>
        </div>
    );
}

export default Page;