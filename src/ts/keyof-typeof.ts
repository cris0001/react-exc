interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'user';
}


//Typ UserKeys — union wszystkich kluczy User
type UserKeys = keyof User


//Typ Config na podstawie tej zmiennej:
const config = { host: 'localhost', port: 3000, debug: false };


type Config = typeof config


//Funkcję getValue która przyjmuje obiekt i klucz i zwraca wartość — użyj keyof i typeof

function getValue<T extends object,K extends keyof T>(obj:T, key:K):T[K]{

    return obj[key]
}

// Typ Color z tego obiektu przez as const:

const COLORS = { red: '#ff0000', green: '#00ff00', blue: '#0000ff' } as const

// typeof COLORS = { red: '#ff0000'; green: '#00ff00'; blue: '#0000ff' }
// keyof typeof COLORS = red | green | blue
// typeof COLORS['red' | 'green' | 'blue'] = '#ff0000' | '#00ff00' | '#0000ff'

type Color = typeof COLORS[keyof typeof COLORS];


const ROUTES = {
    home: '/',
    about: '/about',
    products: '/products',
    contact: '/contact'
} as const;


//Typ Route — union wszystkich wartości (ścieżek)
type Route = typeof ROUTES[keyof typeof ROUTES];


//Typ RouteName — union wszystkich kluczy
type RouteName = keyof typeof ROUTES


//Funkcję navigate która przyjmuje tylko prawidłową ścieżkę (Route)

function navigate(path: Route){
    console.log(path)
}


//Funkcję getRoute która przyjmuje nazwę (RouteName) i zwraca ścieżkę

function getRoute(name:RouteName):Route{
    return ROUTES[name]
}


