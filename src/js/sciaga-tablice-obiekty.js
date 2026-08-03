// ============================================================
// ŚCIĄGAWKA — metody tablic i obiektów
// ============================================================


// ============================================================
// TABLICE — metody mutujące (zmieniają oryginał)
// ============================================================

const arr = [1, 2, 3]

arr.push(4)       // [1, 2, 3, 4]    — dodaje na koniec, zwraca nową długość
arr.pop()         // [1, 2, 3]       — usuwa z końca, zwraca usunięty element
arr.unshift(0)    // [0, 1, 2, 3]   — dodaje na początek, zwraca nową długość
arr.shift()       // [1, 2, 3]       — usuwa z początku, zwraca usunięty element
arr.reverse()     // [3, 2, 1]       — odwraca w miejscu
arr.sort()        // [1, 2, 3]       — sortuje w miejscu (domyślnie jako string!)
arr.sort((a, b) => a - b)  // sortowanie numeryczne rosnąco
arr.sort((a, b) => b - a)  // sortowanie numeryczne malejąco
arr.splice(1, 1)  // usuwa 1 element od indeksu 1


// ============================================================
// TABLICE — metody niemutujące (zwracają nową tablicę/wartość)
// ============================================================

const nums = [1, 2, 3, 4, 5]

// map — przekształca każdy element, zwraca nową tablicę
nums.map(x => x * 2)                    // [2, 4, 6, 8, 10]

// filter — zostawia elementy spełniające warunek
nums.filter(x => x % 2 === 0)           // [2, 4]

// reduce — sprowadza do jednej wartości
nums.reduce((acc, x) => acc + x, 0)     // 15
nums.reduce((acc, x) => [...acc, x * 2], [] )  // [2, 4, 6, 8, 10]

// find — zwraca PIERWSZY pasujący element lub undefined
nums.find(x => x > 3)                   // 4

// findIndex — zwraca indeks pierwszego pasującego lub -1
nums.findIndex(x => x > 3)              // 3

// some — true jeśli CHOĆ JEDEN spełnia warunek
nums.some(x => x > 4)                   // true

// every — true jeśli WSZYSTKIE spełniają warunek
nums.every(x => x > 0)                  // true

// includes — czy element istnieje w tablicy
nums.includes(3)                         // true

// flat — spłaszcza o jeden poziom
    [1, [2, [3]]].flat()                    // [1, 2, [3]]
    [1, [2, [3]]].flat(Infinity)            // [1, 2, 3]

// flatMap — map + flat w jednym
    [[1, 2], [3, 4]].flatMap(x => x)        // [1, 2, 3, 4]
nums.flatMap(x => [x, x * 2])           // [1, 2, 2, 4, 3, 6, ...]

// slice — wycina fragment (nie mutuje)
nums.slice(1, 3)                         // [2, 3]
nums.slice(-2)                           // [4, 5]

// concat — łączy tablice
    [1, 2].concat([3, 4])                   // [1, 2, 3, 4]
    [1, 2].concat(3, [4, 5])               // [1, 2, 3, 4, 5]

// forEach — iteruje, zawsze zwraca undefined
nums.forEach(x => console.log(x))

// indexOf — indeks pierwszego wystąpienia lub -1
nums.indexOf(3)                          // 2

// join — łączy w string
nums.join(', ')                          // "1, 2, 3, 4, 5"

// Array.from — tworzy tablicę z czegokolwiek
Array.from({ length: 3 }, (_, i) => i)  // [0, 1, 2]
Array.from('hello')                      // ['h', 'e', 'l', 'l', 'o']


// ============================================================
// OBIEKTY — metody statyczne
// ============================================================

const obj = { name: 'Anna', age: 25, role: 'dev' }

Object.keys(obj)      // ['name', 'age', 'role']         — klucze
Object.values(obj)    // ['Anna', 25, 'dev']             — wartości
Object.entries(obj)   // [['name','Anna'], ['age',25], ['role','dev']]  — pary [k,v]

Object.fromEntries([['name', 'Anna'], ['age', 25]])
// { name: 'Anna', age: 25 }  — tablica par → obiekt

Object.assign({}, obj, { age: 30 })
// { name: 'Anna', age: 30, role: 'dev' }  — płytka kopia + nadpisanie

Object.freeze(obj)   // obiekt niemutowalny — próba zmiany ignorowana
Object.hasOwn(obj, 'name')  // true — własna właściwość (nie z prototypu)


// ============================================================
// MAP vs OBJECT — kiedy co używać
// ============================================================

// Object — gdy klucze to znane stringi, struktura danych
const config = { host: 'localhost', port: 3000 }

// Map — gdy klucze dynamiczne lub nie-stringi, częste dodawanie/usuwanie
// const cache = new Map<string, number>()
const cache = new Map()
cache.set('key', 1)
cache.get('key')        // 1
cache.has('key')        // true
cache.delete('key')
cache.size              // liczba wpisów

// WeakMap — klucz musi być OBIEKTEM, słaba referencja (GC może usunąć)
const weakCache = new WeakMap()
weakCache.set(obj, 'wartość')  // obj musi być obiektem, nie prymitywem


// ============================================================
// SPREAD & DESTRUKTURYZACJA
// ============================================================

// spread tablicy
const a = [1, 2, 3]
const b = [...a, 4, 5]              // [1, 2, 3, 4, 5]
const [first, ...rest] = a          // first=1, rest=[2,3]

// spread obiektu
const user = { name: 'Anna', age: 25 }
const updated = { ...user, age: 30 }  // { name:'Anna', age:30 }
const { name, ...others } = user      // name='Anna', others={age:25}

// nullish coalescing ??
null ?? 'default'       // 'default'
undefined ?? 'default'  // 'default'
0 ?? 'default'          // 0 — 0 nie jest null/undefined!
0 || 'default'          // 'default' — || traktuje 0 jako falsy

// optional chaining ?.
const user2 = { address: { city: 'Warsaw' } }
user2?.address?.city    // 'Warsaw'
user2?.phone?.number    // undefined — nie rzuca błędu