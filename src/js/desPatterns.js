class Logger {
    static instance = null;
    logs=[]
    static getInstance() {

        if (!Logger.instance) Logger.instance = new Logger();
        return Logger.instance;
    }

    log(msg) { this.logs.push(msg); }
}



const logger = Logger.getInstance()


class EventEmitter  {

    listeners = {}

    on(event, cb) { (this.listeners[event] ??= []).push(cb); }

    off(event,cb){
        this.listeners[event]= this.listeners[event]?.filter(el=> el!==cb)
    }

    emit(event, data) { this.listeners[event]?.forEach(cb => cb(data)); }

}

const xd = new EventEmitter()

xd.on('xd', ()=> console.log('xd'))


function createPayment(method){

    if(method==='a') return 'a provider'
    if(method==='b') return 'b provider'
}


const sortStrategies = {
    byPrice: (a, b) => a.price - b.price,
    byName: (a, b) => a.name.localeCompare(b.name),
};
const sorted = products.sort(sortStrategies['byPrice']);


const fetchData = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // czekaj 1s
    return { data: 'wynik' };
};

function withLogging(fn) {
    return async function(...args) {
        console.log(`wywołano: ${fn.name}`);
        const result = await fn(...args);
        console.log(`wynik:`, result);
        return result;
    };
}

function withRetry(fn, retries = 3) {
    return async function(...args) {
        for (let i = 0; i < retries; i++) {
            try {
                return await fn(...args); // sukces — zwróć i wyjdź
            } catch (err) {
                console.log(`retry ${i + 1}/${retries}...`);
                if (i === retries - 1) throw err; // ostatni retry — rzuć błąd
            }
        }
    };
}


function withCache(fn){

    const cache  = new Map()

    return async function(...args){
        const key = JSON.stringify(args);
        if (cache.has(key)) return cache.get(key);
        const res = await fn(...args);
        cache.set(key,res)
        return res
    }

}

    const xd = withLogging(withRetry(withCache(fetchData)))