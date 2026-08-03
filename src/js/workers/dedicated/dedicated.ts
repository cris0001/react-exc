


self.onmessage = (e: MessageEvent<number[]>) => {
    console.log('worker dostał:', e.data);
    const result = e.data.reduce((a, b) => a + b, 0);
    console.log('wynik:', result);
    self.postMessage(result); // result: number
};

