//
// type TreeNode = {
//     id: number
//     name: string
//     children: TreeNode[]
// }
//
// const tree = {
//     id: 1, name: 'root', children: [
//         { id: 2, name: 'a', children: [] },
//         { id: 3, name: 'b', children: [
//                 { id: 4, name: 'c', children: [] }
//             ]}
//     ]
// }
// const tree2 = {
//     id: 1, name: 'root', children: [
//         { id: 2, name: 'a', children: [] },
//         { id: 3, name: 'b', children: [
//                 { id: 4, name: 'c', children: [
//                     { id: 5, name: 'd', children: [] }
//                     ]}
//             ]}
//     ]
// }
//
// type TreeNodeWithDepth = TreeNode & { depth: number }
//
//
// //Napisz zipTrees — połącz dwa drzewa, sumując id odpowiadających sobie node'ów:
//
// function zipTrees(a: TreeNode, b: TreeNode): TreeNode {
//     return {
//         ...a,
//         id: a.id + b.id,
//         children: a.children.map((child, i) => zipTrees(child, b.children[i]))
//     }
// }
//
// const tree1 = { id: 1, name: 'a', children: [
//         { id: 2, name: 'b', children: [] }
//     ]}
//
// const tree2 = { id: 10, name: 'x', children: [
//         { id: 20, name: 'y', children: [] }
//     ]}
//
// zipTrees(tree1, tree2)
// // { id: 11, name: 'a', children: [
// //     { id: 22, name: 'b', children: [] }
// // ]}
//
// //Napisz pruneTree — usuń wszystkie node'y których id jest parzyste:
//
// function pruneTree(tree: TreeNode): TreeNode | undefined {
//     if(tree.id % 2 === 0) return undefined
//
//     return{
//         ...tree,
//         children: tree.children.flatMap(child => {
//             const result = pruneTree(child)
//             return result ? [result] : []
//         })
//     }
//
//     // children: tree.children
//     //     .filter(child => pruneTree(child) !== undefined)
//     //     .map(child => pruneTree(child)!)
//
// }
//
// pruneTree(tree)
// // root(1) zostaje
// // id=2 usunięty (parzyste)
// // id=3 zostaje
// // id=4 usunięty (parzyste)
// // id=5 zostaje
//
//
//
// //Napisz mirrorTree — odwróć kolejność dzieci w każdym nodzie:
//
// function mirrorTree(tree: TreeNode): TreeNode {
//
//     return {
//         ...tree,
//         children: tree.children.map((x)=>mirrorTree(x)).reverse()
//     }
// }
//
// // przed:
// // root → [id=2, id=3]
// // id=3 → [id=4]
//
// // po:
// // root → [id=3, id=2]
// // id=3 → [id=4]  ← bez zmian bo jedno dziecko
//
// // Napisz collectValues — zbierz wszystkie wartości danego pola z całego drzewa:
//
// function collectValues(tree: TreeNode, field: keyof TreeNode): any[] {
//
//     return [tree[field], ...tree.children.flatMap(child => collectValues(child, field))]
// }
//
// collectValues(tree, 'name')  // ['root', 'a', 'b', 'c', 'd']
// collectValues(tree, 'id')    // [1, 2, 3, 4, 5]
//
//
// function maxDepth(tree2: TreeNode): number {
//
//     if(tree.children.length === 0) return 1
//     const depths = tree.children.map(child => maxDepth(child))
//     return 1 + Math.max(...depths)
//
// }
// //Napisz findDeepest — znajdź node który jest najgłębiej w drzewie:
//
// function findDeepest(tree: TreeNode): TreeNode {
//     if(tree.children.length===0) return tree
//
//  let x= tree.children.map((el)=> findDeepest(el))
//     return x.reduce((deepest, candidate) =>
//         maxDepth(candidate) > maxDepth(deepest) ? candidate : deepest
//     )
//
//
// }
//
// findDeepest(tree)  // { id:5, name:'d', children:[] }
//
//
//
// //Napisz transformTree która dodaje pole depth do każdego node'a — jak głęboko jest w drzewie:
//
// function transformTree(tree: TreeNode, depth: number = 0): TreeNodeWithDepth {
//
//     if(tree.children.length===0) return  {...tree,depth}
//
//     return {
//         ...tree,
//         depth,
//         children: tree.children.map(child => transformTree(child, depth + 1))
//     }
//
//
// }
//
//
// //Napisz hasNode — sprawdź czy node z danym id istnieje w drzewie:
//
//
// function hasNode(tree: TreeNode, id: number): boolean {
//     if(tree.id === id) return true
//     for(const child of tree.children) {
//         const res = hasNode(child,id)
//         if(res) return true
//     }
// return false
// }
//
// hasNode(tree, 4)   // true
// hasNode(tree, 99)  // false
//
// //Napisz sumLeaves — zsumuj id wszystkich leafów:
//
// function sumLeaves(tree: TreeNode): number {
//
//     if(tree.children.length === 0) return tree.id
//     return  tree.children.reduce((acc,item)=>{
//         return acc + sumLeaves(item)
//     },0)
// }
//
// sumLeaves(tree)  // 2 + 5 = 7
//
// //Napisz getLeaves — zwróć wszystkie leaf node'y (bez dzieci
// // flatMap — spłaszcza o jeden poziom
// function getLeaves(tree: TreeNode): TreeNode[] {
//    if(tree.children.length ===0) return [tree]
//
//     return tree.children.flatMap(child => getLeaves(child))
// }
//
//
// function getLeaves2(tree: TreeNode): TreeNode[] {
//     if(tree.children.length === 0) return [tree]
//
//     return tree.children.reduce((acc, child) => {
//         return [...acc, ...getLeaves(child)]
//     }, [] as TreeNode[])
// }
// getLeaves(tree)// [{ id: 2, ... }, { id: 5, ... }]
//
//
// //Napisz pathToNode — znajdź ścieżkę od roota do szukanego node'a:
//
//
//
// function pathToNode(tree: TreeNode, id: number): number[] | undefined {
//     if(tree.id === id) return [tree.id]  // ← przed pętlą!
//     if(tree.children.length === 0) return undefined
//
//     for(const child of tree.children) {
//         const result = pathToNode(child, id)
//         if(result) return [tree.id, ...result]
//     }
// }
//
// pathToNode(tree, 5)  // [1, 3, 4, 5]  ← id-ki po drodze
// pathToNode(tree, 99)
//
//
//
// //liczy ilosc node ow
//
// function countNodes(tree: TreeNode): number {
//     let x = 1
//     return x + tree.children.reduce((acc, item) => {
//         return acc + countNodes(item)
//     }, 0)
//
//
//
// //Napisz maxDepth — znajdź maksymalną głębokość drzewa:
//
// function maxDepth(tree2: TreeNode): number {
//
//     if(tree.children.length === 0) return 1
//     const depths = tree.children.map(child => maxDepth(child))
// return 1 + Math.max(...depths)
//
// }
//
//
//
// // Napisz funkcję findInTree która szuka elementu w drzewie:
//
//
// function findInTree(tree: TreeNode, id: number): TreeNode | undefined {
//     if(tree.id === id) return tree
//
//     for(const child of tree.children) {
//         const result = findInTree(child, id)
//         if(result) return result
//     }
//
//     return undefined
// }
//
//
// findInTree(tree, 4)  // { id: 4, name: 'c', children: [] }
// findInTree(tree, 99) // undefined
//
//
// // Napisz funkcję countOccurrences która liczy wystąpienia każdego elementu
// // w zagnieżdżonej tablicy
//
// function countOccurrences(arr: any[]): Record<string, number> {
//
//
//  return arr.reduce((acc,item)=>{
//     if(!Array.isArray(item)){
//         acc[item] = (acc[item] ?? 0) + 1  // ← dodaj 1 do licznika
//     }else{
//         const nested = countOccurrences(item)
//         Object.keys(nested).forEach(key => {
//             acc[key] = (acc[key] ?? 0) + nested[key]
//         })
//     }
//
//     return acc
//     },{})
//
//
// }
//
//
// function flattenDeep(arr: any[]): any[] {
//
//     let res  =[]
//
//     for(const item of arr){
//
//         if(Array.isArray(item)){
//             res.push(...flattenDeep(item))
//         }else{
//             res.push(item)
//         }
//     }
//
//     return res
// }
// function sumNested(arr: (number | number[])[]): number {
//     let sum=0
//     for(const item of arr){
//         if(Array.isArray(item)){
//             sum += sumNested(item)
//         }else{
//             sum= sum + item
//         }
//     }
//     return sum
//
// }
//
// //deep equal
// //deep equal
// //deep equal
// //deep equal
//
// function deepEqual(a: unknown, b: unknown): boolean {
//     if(a === b) return true
//     if(typeof a !== 'object' || typeof b !== 'object') return false
//     if(a === null || b === null) return false
//
//     const keysA = Object.keys(a as object)
//     const keysB = Object.keys(b as object)
//
//     if(keysA.length !== keysB.length) return false
//
//     return keysA.every(key =>
//         deepEqual(
//             (a as Record<string, unknown>)[key],
//             (b as Record<string, unknown>)[key]
//         )
//     )
// }
//
//
// // Napisz createLogger który:
// //
// //     trzyma historię logów w closure
// // zwraca obiekt z metodami log(message), getLogs(), clear()
//
//
//     function createLogger() {
//         let arr: string[] = []
//
//         return {
//             log: (value: string) => arr.push(value),
//             getLogs: (): string[] => arr,
//             clear: (): void => { arr = [] }
//         }
//     }
//
//
//
// const logger2 = createLogger()
//
// logger2.log('hello')
// logger2.log('world')
// logger2.getLogs()  // ['hello', 'world']
// logger2.clear()
// logger2.getLogs()  // []
//
// //once
// //once
// //once
// //once
// //Funkcja która może być wywołana tylko raz — każde kolejne wywołanie zwraca wynik pierwszego. 💪
//
//     function once2<T extends (...args:any[]) => any>(fn:T):T{
//
//         let isCalled = false
//         let fnRes: ReturnType<T>|undefined=undefined
//
//         return ((...args:Parameters<T>)=>{
//
//             if(!isCalled) {
//                 isCalled=true
//                 fnRes=fn(...args)
//                 return fnRes
//             }
//             return fnRes
//         }) as T
//
//     }
//
//
// //throttle
// //throttle
// //throttle
// //throttle
//
// function throttle<T extends (...args: any[]) => any>(fn: T, ms: number): T {
//     let lastCall = 0
//
//     return ((...args: any[]) => {
//         const now = Date.now()
//         if(now - lastCall >= ms) {
//             lastCall = now
//             return fn(...args)
//         }
//     }) as T
// }
//
//
// //debounce
// //debounce
// //debounce
// //debounce
//
//
//
// function debounce<T extends (...args: any[]) => any>(fn: T, ms: number): T {
//     let timer: ReturnType<typeof setTimeout>
//
//     return ((...args: any[]) => {
//         clearTimeout(timer)
//         timer = setTimeout(() => fn(...args), ms)
//     }) as T
// }
//
//
//
//
//
// //evnet emitter
// //evnet emitter
// //evnet emitter
// //evnet emitter
// class EventEmitter {
//     private listeners: Record<string, Function[]> = {}
//
//     on(event: string, fn: Function) {
//         if(!this.listeners[event]) this.listeners[event] = []
//         this.listeners[event].push(fn)
//     }
//
//     off(event: string, fn: Function) {
//         this.listeners[event] = this.listeners[event]?.filter(l => l !== fn) ?? []
//     }
//
//     emit(event: string, ...args: any[]) {
//         this.listeners[event]?.forEach(fn => fn(...args))
//     }
// }
//
// //deep clone
// //deep clone
// //deep clone
// //deep clone
// // Object.entries — zamienia obiekt na tablicę par [klucz, wartość]:
// // Object.fromEntries — odwrotność, zamienia tablicę par na obiekt:
//
// function deepClone<T>(obj: T): T {
//     if(obj === null || typeof obj !== 'object') return obj
//     if(Array.isArray(obj)) return obj.map(deepClone) as T
//
//     return Object.fromEntries(
//         Object.entries(obj as object).map(([k, v]) => [k, deepClone(v)])
//     ) as T
// }
//
//
//
// // Napisz makeRateLimiter który:
// //
// //     przyjmuje limit: number — maksymalna liczba wywołań
// // zwraca funkcję która:
// //
// //     wykonuje przekazaną funkcję jeśli limit nie został przekroczony
// // ignoruje wywołanie gdy limit wyczerpany
//
//
// function makeRateLimiter(limit:number){
//
//
//     return ((fn:any)=>{
//
//     })
//
// }
//
//
// const limited = makeRateLimiter(3)
//
// limited(() => console.log('wywołanie'))  // "wywołanie"
// limited(() => console.log('wywołanie'))  // "wywołanie"
// limited(() => console.log('wywołanie'))  // "wywołanie"
// limited(() => console.log('wywołanie'))  // (ignorowane — limit wyczerpany)
//
// // Napisz makeTimer który:
// //
// //     nie przyjmuje argumentów
// // zwraca obiekt z dwoma metodami:
// //
// //     start() — zapisuje aktualny czas
// // elapsed() — zwraca ile milisekund minęło od start()
//
//
//
// function makeTimer(){
//     let startTime =0
//
//
//     return{
//         start:()=> startTime= Date.now(),
//         elapsed:()=>{
//             let now= Date.now()
//             return now-startTime
//         }
//     }
//
// }
//
// const timer = makeTimer()
//
// timer.start()
// // ... jakiś kod ...
// timer.elapsed()  // np. 1523 — ile ms minęł
//
//
//
// // Napisz makeLogger który:
// //
// //     przyjmuje prefix: string
// // zwraca funkcję która loguje wiadomość z prefixem
// // zlicza ile razy została wywołana
//
//
// function makeLogger(prefix: string): (txt:string)=>string{
//
//     let counter = 0
//     return ((txt)=>{
//         counter ++
//         return `${prefix} ${txt} ${counter}`
//     })
// }
//
// const logger = makeLogger('[INFO]')
//
// logger('start')    // "[INFO] start (wywołanie: 1)"
// logger('koniec')   // "[INFO] koniec (wywołanie: 2)"
// logger('błąd')     // "[INFO] błąd (wywołanie: 3)"
//
//
// // Kolejne — napisz makeAdder:
// //
// //     przyjmuje liczbę x
// // zwraca funkcję która dodaje x do swojego argumentu
//
//
// function makeAdder(a:number): (b:number)=> number{
//
//
//     return (b)=> a + b
// }
//
//
// const add5 = makeAdder(5)
// const add10 = makeAdder(10)
//
// add5(3)   // 8
// add10(3)  // 13
// add5(10)  // 15
//
//
// // Napisz funkcję makeMultiplier która:
// //
// //     przyjmuje liczbę x
// // zwraca funkcję która mnoży swój argument przez x
//
//
// function makeMultiplier(x: number): (a: number) => number {
//     return (a: number) => x * a
// }
//
// const double = makeMultiplier(2)
// const triple = makeMultiplier(3)
//
// double(5)  // 10
// triple(5)  // 15
// double(10) // 20
//
// //Napisz mySome i myEvery — własne implementacje Array.some i Array.every
//
//
// function mySome<T>(arr: T[], fn: (item: T) => boolean): boolean {
//
//     for(const item of arr){
//         if(fn(item)) return true
//     }
//     return false
//
// }
//
// function myEvery<T>(arr: T[], fn: (item: T) => boolean): boolean {
//
//     for(const item of arr){
//         if(!fn(item)) return false
//     }
//
//     return true
// }
//
//
// mySome([1, 2, 3], x => x > 2)   // true — 3 pasuje
// mySome([1, 2, 3], x => x > 10)  // false — nikt nie pasuje
//
// myEvery([2, 4, 6], x => x % 2 === 0)  // true — wszystkie parzyste
// myEvery([1, 2, 3], x => x % 2 === 0)  // false — 1 i 3 nieparzyste
//
//
// //Napisz myFind — własna implementacja Array.find:
//
// function myFind<T>(arr:T[], fn:(item:T)=> boolean):T | undefined{
//
//
//     for(const item of arr) {
//         if(fn(item)) return item
//     }
//
//
// }
//
// myFind([1, 2, 3, 4], x => x > 2)     // 3 — pierwszy pasujący
// myFind([1, 2, 3], x => x > 10)        // undefined — brak pasującego
//
// //Napisz myReduce — własna implementacja Array.reduce
//
//
// function myReduce<T,U>(arr: T[], fn:(acc:U, item:T)=> U, initial: U):U{
//     let acc = initial
//
//     for(const item of arr) {
//         const res= fn(acc,item)
//         acc=res
//
//     }
//     return acc
// }
//
//
// myReduce([1, 2, 3, 4], (acc, x) => acc + x, 0)  // 10
// myReduce([1, 2, 3], (acc, x) => [...acc, x * 2], [] as number[])  // [2, 4, 6]
//
// //Napisz myFilter — własna implementacja Array.filter:
//
//
// function myFilter<T>(arr:T[],fn:(item:T)=> boolean):T[]{
//
//
//     return (arr.reduce((acc,item)=>{
//         const res = fn(item)
//         if(res) acc.push(item)
//         return acc
//     },[] as T[]))
//
// }
//
// // Napisz funkcję myMap — własna implementacja natywnego Array.map:
//
//
//
// function myMap<T, U>(arr: T[], fn: (item: T) => U): U[] {
//
//     return (arr.reduce((acc,item)=>{
//         acc.push(fn(item))
//         return acc
//     },[] as U[]))
// }
//
// myMap([1, 2, 3], x => x * 2)  // [2, 4, 6]
// myMap(['a', 'b', 'c'], x => x.toUpperCase())  // ['A', 'B', 'C']
//
//
//
// // Napisz funkcję myQueue która implementuje kolejkę:
// //
// //    enqueue(item) — dodaje element na koniec
// // dequeue() — usuwa i zwraca element z początku
// // front() — zwraca pierwszy element bez usuwania
// // size() — zwraca liczbę elementów
//
//
// function myQueue<T>(){
//
//     const items:T[] = []
//
//
//     return{
//         enqueue: (i:T)=> items.push(i),
//         front:()=> items[0],
//         dequeue:()=> items.shift(),
//         size:()=> items.length
//     }
// }
//
//
//
//
//
// const queue = myQueue<number>()
//
// queue.enqueue(1)
// queue.enqueue(2)
// queue.enqueue(3)
// queue.front()    // 1
// queue.dequeue()  // 1
// queue.size()     // 2
//
//
// // Napisz funkcję myStack która implementuje stos używając closure:
// //
// //     push(item) — dodaje element na górę
// // pop() — usuwa i zwraca element z góry
// // peek() — zwraca element z góry bez usuwania
// // size() — zwraca liczbę elementów
// //
// // tsconst stack = myStack<number>()
// //
// // stack.push(1)
// // stack.push(2)
// // stack.push(3)
// // stack.peek()  // 3
// // stack.pop()   // 3
// // stack.size()  // 2
//
//
// function myStack<T>(){
//
//     const items:T[] = []
//
//     return{
//         push:(item:T)=> items.push(item),
//         peek:()=> items[items.length - 1],
//         pop:()=> items.pop(),
//         size:()=> items.length
//     }
// }
//
// const stack = myStack<number>()
//
//
//
//
// //Napisz funkcję curry która przekształca funkcję przyjmującą dwa argumenty w funkcję curried:
//
// //
// // function curry<A, B, C>(fn: (a: A, b: B) => C): (a: A) => (b: B) => C {
// //     // tutaj
// // }
// //
// // const add = curry((a: number, b: number) => a + b)
// //
// // add(2)(3)  // 5
// // add(10)(5) // 15
// //
// // const add10 = add(10)  // funkcja czekająca na drugi argument
// // add10(5)   // 15
// // add10(3)   // 13
//
//
//
//
//
// function curry<A, B, C>(fn: (a: A, b: B) => C): (a: A) => (b: B) => C {
//
//     return (a: A) => {
//
//         return (b:B)=>{
//             return  fn(a,b)
//         }
//     }
// }
//
//
//
// //Napisz funkcję once która sprawia że funkcja może być wywołana tylko raz
// // — każde kolejne wywołanie zwraca wynik pierwszego:
//
//
// // function once<T extends (...args: any[]) => any>(fn: T): T {
// //     // tutaj
// // }
// //
// // const init = once((x: number) => {
// //     console.log('inicjalizuję!')
// //     return x * 2
// // })
// //
// // init(5)  // "inicjalizuję!" → 10
// // init(3)  // (brak loga) → 10  ← wynik z pierwszego wywołania
// // init(7)  // (brak loga) → 10  ← wynik z pierwszego wywołania
//
//
//
//
// function once<T extends (...args:any[]) => any>(fn:T){
//
//     let isCalled = false
//     let fnRes: ReturnType<T>|undefined=undefined
//
//     return ((...args:Parameters<T>)=>{
//
//         if(!isCalled) {
//             isCalled=true
//             const result =fn(...args)
//             fnRes=result
//             return fnRes
//         }
//         return fnRes
//     })
//
// }
//
//
//
// //Napisz funkcję pipe która łączy funkcje w potok —
// // wynik jednej idzie jako argument do następnej:
//
// // function pipe<T>(...fns: ((arg: T) => T)[]): (arg: T) => T {
// //     // tutaj
// // }
// //
// // const transform = pipe(
// //     (x: number) => x * 2,
// //     (x: number) => x + 1,
// //     (x: number) => x * 3,
// // )
// //
// // transform(5)
// // // 5 * 2 = 10
// // // 10 + 1 = 11
// // // 11 * 3 = 33
//
//
// function pipe<T>(...fns: ((arg: T) => T)[]): (arg: T) => T {
//
//
//     return (arg:T)=>{
//
//         return fns.reduce((acc,fn)=> fn(acc),arg)
//     }
// }
//
//
//
//
//
//
//
//
// // Napisz funkcję flatten która spłaszcza zagnieżdżoną tablicę o jeden poziom:
// // function flatten<T>(arr: (T | T[])[]): T[] {
// //     // tutaj
// // }
// //
// // flatten([1, [2, 3], [4, 5], 6])
// // // [1, 2, 3, 4, 5, 6]
//
//
// function flatten<T>(arr: (T | T[])[]): T[] {
//     return arr.reduce<T[]>((acc, item) => {
//         return acc.concat(item)
//     }, [])
// }
//
//
// // Napisz własną funkcję groupBy która działa jak Object.groupBy — grupuje elementy tablicy według klucza:
//
// //
// // const people = [
// //    { name: 'Anna', role: 'dev' },
// //    { name: 'Piotr', role: 'dev' },
// //    { name: 'Kasia', role: 'designer' },
//
// // groupBy(people, p => p.role)
//
// function groupBy<T>(arr: T[], fn: (item: T) => string): Record<string, T[]> {
//     return arr.reduce((acc, item) => {
//         const key = fn(item)
//         if(!acc[key]) acc[key]=[]
//         acc[key].push(item)
//         return acc
//     }, {} as Record<string, T[]>)
// }
//
//
//
//
// function memoize<T extends (...args: any[]) => any>(fn:T){
//
//     const cache  = new Map<string, ReturnType<T>>()
//
//     return (...args: Parameters<T>): ReturnType<T> => {
//
//         const key = JSON.stringify(args)
//
//         if(cache.has(key)){
//             return cache.get(key)!
//         }else{
//
//             let result = fn(...args)
//             cache.set(key,result)
//             return result
//         }
//
//     }
// }