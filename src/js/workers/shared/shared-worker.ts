// shared-worker.ts
export {};

declare const self: SharedWorkerGlobalScope;

export type Message =
    | { type: 'ADD'; item: string }
    | { type: 'GET' }

let cart: string[] = [];

self.onconnect = (e: MessageEvent) => {
    const port = e.ports[0];

    port.onmessage = (e: MessageEvent<Message>) => {
        if (e.data.type === 'ADD') {
            cart.push(e.data.item);
            port.postMessage(cart);
        }
        if (e.data.type === 'GET') {
            port.postMessage(cart);
        }
    };
};