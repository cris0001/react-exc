// 1. Logger — globalne logowanie
class Logger {
    private static instance: Logger | null = null
    private logs: string[] = []

    private constructor() {}
    static getInstance(): Logger {
        if (!Logger.instance) Logger.instance = new Logger()
        return Logger.instance
    }

    log(msg: string) { this.logs.push(msg) }
    getLogs() { return this.logs }
}

// 2. Config — konfiguracja aplikacji
class Config {
    private static instance: Config | null = null
    private settings: Record<string, any> = {}

    private constructor() {
        this.settings = {
            apiUrl: process.env.API_URL,
            timeout: 5000,
            theme: 'dark',
        }
    }

    static getInstance(): Config {
        if (!Config.instance) Config.instance = new Config()
        return Config.instance
    }

    get(key: string) { return this.settings[key] }
    set(key: string, value: any) { this.settings[key] = value }
}

// 3. Database — jedno połączenie
class Database {
    private static instance: Database | null = null
    private connection: any

    private constructor() {
        this.connection = createConnection() // ciężka operacja, robisz raz
    }

    static getInstance(): Database {
        if (!Database.instance) Database.instance = new Database()
        return Database.instance
    }

    query(sql: string) { return this.connection.execute(sql) }
}

// 4. Cache — globalny cache w pamięci
class Cache {
    private static instance: Cache | null = null
    private store = new Map<string, any>()

    private constructor() {}
    static getInstance(): Cache {
        if (!Cache.instance) Cache.instance = new Cache()
        return Cache.instance
    }

    get(key: string) { return this.store.get(key) }
    set(key: string, value: any) { this.store.set(key, value) }
    clear() { this.store.clear() }
}

// Użycie — wszędzie ta sama instancja
Logger.getInstance().log('start')
Config.getInstance().get('apiUrl')
Database.getInstance().query('SELECT *')
Cache.getInstance().set('user:1', userData)



// -----------------------------------------------------
// -----------------------------------------------------
// -----------------------------------------------------
// -----------------------------------------------------
// -----------------------------------------------------
// -----------------------------------------------------



// === OBSERVER ===
// Pub/sub — subskrybenci dostają powiadomienia o zmianach
class EventEmitter<Events extends Record<string, any>> {
    private listeners = new Map<keyof Events, Array<(payload: any) => void>>()

    on<K extends keyof Events>(event: K, fn: (p: Events[K]) => void) {
        if (!this.listeners.has(event)) this.listeners.set(event, [])
        this.listeners.get(event)!.push(fn)
    }

    off<K extends keyof Events>(event: K, fn: (p: Events[K]) => void) {
        this.listeners.set(event, (this.listeners.get(event) ?? []).filter(f => f !== fn))
    }

    emit<K extends keyof Events>(event: K, payload: Events[K]) {
        this.listeners.get(event)?.forEach(fn => fn(payload))
    }
}

// Typowe użycia: WebSocket events, custom events w aplikacji,
// Redux store subscribers, React state libraries (Zustand, MobX)


// === FACTORY ===
// Funkcja tworzy obiekty bez używania new bezpośrednio
interface PaymentProvider {
    process(amount: number): void
}

class StripeProvider implements PaymentProvider {
    process(amount: number) { /* stripe API */ }
}
class BlikProvider implements PaymentProvider {
    process(amount: number) { /* blik API */ }
}

function createPayment(method: 'stripe' | 'blik'): PaymentProvider {
    switch (method) {
        case 'stripe': return new StripeProvider()
        case 'blik': return new BlikProvider()
    }
}

// Typowe użycia: różne providery (płatności, notyfikacje, storage),
// tworzenie komponentów na podstawie typu, parsery różnych formatów


// === STRATEGY ===
// Wymienna logika — wybierasz strategię w runtime
type SortStrategy<T> = (a: T, b: T) => number

const sortStrategies = {
    byPrice: (a, b) => a.price - b.price,
    byName: (a, b) => a.name.localeCompare(b.name),
    byDate: (a, b) => a.date.getTime() - b.date.getTime(),
}

function sortItems<T>(items: T[], strategy: SortStrategy<T>): T[] {
    return [...items].sort(strategy)
}

sortItems(products, sortStrategies.byPrice)

// Typowe użycia: sortowanie, walidacja, formatowanie,
// algorytmy kompresji, strategie kalkulacji (rabaty, ceny)


// === DECORATOR ===
// Owijasz funkcję dodatkową logiką bez modyfikacji jej kodu
function withLogging<T extends (...args: any[]) => any>(fn: T): T {
    return ((...args: any[]) => {
        console.log('input:', args)
        const result = fn(...args)
        console.log('output:', result)
        return result
    }) as T
}

const loggedAdd = withLogging((a: number, b: number) => a + b)
loggedAdd(2, 3) // loguje input/output

// Typowe użycia: cache (memoize), logging, retry, throttle/debounce,
// auth checks, validation, timing/performance measuring


// === MODULE (ES Modules) ===
// Enkapsulacja stanu w pliku, eksportujesz publiczne API
// cart.ts
let items: any[] = []  // prywatne — nie eksportowane

export function addItem(item: any) { items.push(item) }
export function getItems() { return items }
export function clearCart() { items = [] }
// items niedostępny z zewnątrz, tylko przez funkcje


// === ADAPTER ===
// Dopasowanie interfejsu jednego API do innego
interface NewLogger {
    info(msg: string): void
    error(msg: string): void
}

class OldLogger {
    log(level: 'info' | 'error', msg: string) { console.log(level, msg) }
}

class LoggerAdapter implements NewLogger {
    constructor(private old: OldLogger) {}
    info(msg: string) { this.old.log('info', msg) }
    error(msg: string) { this.old.log('error', msg) }
}

// Typowe użycia: integracja z legacy code, opakowanie zewnętrznej biblioteki,
// migracja API bez przepisywania konsumentów


// === BUILDER ===
// Tworzenie złożonych obiektów krok po kroku
class QueryBuilder {
    private query = { select: [], where: {}, limit: 0 }

    select(...fields: string[]) { this.query.select = fields; return this }
    where(key: string, value: any) { this.query.where[key] = value; return this }
    limit(n: number) { this.query.limit = n; return this }
    build() { return this.query }
}

new QueryBuilder()
    .select('id', 'name')
    .where('active', true)
    .limit(10)
    .build()

// Typowe użycia: zapytania do bazy (Prisma, Knex), tworzenie formularzy,
// konstrukcja URL z parametrami, konfiguracja