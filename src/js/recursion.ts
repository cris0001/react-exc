type TreeNode = {
    id: number
    name: string
    children: TreeNode[]
}

type TreeNodeWithDepth = TreeNode & { depth: number }

const tree = {
    id: 1, name: 'root', children: [
        { id: 2, name: 'a', children: [] },
        { id: 3, name: 'b', children: [
                { id: 4, name: 'c', children: [] }
            ]}
    ]
}

const tree2 = {
    id: 1, name: 'root', children: [
        { id: 2, name: 'a', children: [] },
        { id: 3, name: 'b', children: [
                { id: 4, name: 'c', children: [
                        { id: 5, name: 'd', children: [] }
                    ]}
            ]}
    ]
}


// ============================================================
// REKURENCJA
// Schemat zawsze taki sam:
// 1. BASE CASE — kiedy przestać (prymityw, brak dzieci, pusta tablica)
// 2. RECURSIVE CASE — wywołaj siebie na mniejszym problemie
//
// Kiedy używać której metody:
// for       — gdy chcesz przerwać pętlę (return w środku)
// reduce    — gdy budujesz jeden wynik (liczba, obiekt)
// map       — gdy przekształcasz każdy element (ta sama struktura)
// flatMap   — gdy zbierasz tablice z dzieci w jedną płaską tablicę
// ============================================================


// ============================================================
// TABLICE ZAGNIEŻDŻONE
// ============================================================

// ------------------------------------------------------------
// sumNested
// Sumuje wszystkie liczby w zagnieżdżonej tablicy
// ------------------------------------------------------------




//
// Problem z typem — (number | number[])[] nie obsługuje zagnieżdżenia głębszego niż jeden poziom. [6, 7] wewnątrz [5, [6, 7]] to już za głęboko.
//     Zmień typ na any[]:
// tsfunction sumNested(arr: any[]): number {
//     let sum = 0
//     for (const item of arr) {
//         if (Array.isArray(item)) {
//             sum += sumNested(item)
//         } else {
//             sum += item
//         }
//     }
//     return sum
// }
// (number | number[])[] oznacza "tablica numberów lub tablic numberów" — tylko dwa poziomy. any[] odpowiada dowolnej głębokości. 💪





function sumNested(arr: (number | number[])[]): number {
    let sum = 0
    for (const item of arr) {
        if (Array.isArray(item)) {
            sum += sumNested(item)  // rekurencja — wejdź głębiej
        } else {
            sum += item             // base case — dodaj liczbę
        }
    }
    return sum
}

sumNested([1, 2, [3, 4], [5, [6, 7]]])  // 28


// ------------------------------------------------------------
// flattenDeep
// Spłaszcza tablicę dowolnie głęboko
// ...flattenDeep(item) — spread bo flattenDeep zwraca tablicę
// ------------------------------------------------------------
function flattenDeep(arr: any[]): any[] {
    let res: any[] = []
    for (const item of arr) {
        if (Array.isArray(item)) {
            res.push(...flattenDeep(item))
        } else {
            res.push(item)
        }
    }
    return res
}

flattenDeep([1, [2, [3, [4, [5]]]]])  // [1, 2, 3, 4, 5]


// ------------------------------------------------------------
// countOccurrences
// Liczy wystąpienia każdego elementu w zagnieżdżonej tablicy
// nested — wynik rekurencji, scal z acc przez Object.keys + forEach
// (acc[item] ?? 0) + 1 — jeśli klucz nie istnieje zacznij od 0
// ------------------------------------------------------------
function countOccurrences(arr: any[]): Record<string, number> {
    return arr.reduce((acc, item) => {
        if (!Array.isArray(item)) {
            acc[item] = (acc[item] ?? 0) + 1
        } else {
            const nested = countOccurrences(item)
            Object.keys(nested).forEach(key => {
                acc[key] = (acc[key] ?? 0) + nested[key]
            })
        }
        return acc
    }, {})
}

countOccurrences([1, 2, 1, [3, 2, [1, 1]]])  // { '1': 4, '2': 2, '3': 1 }


// ============================================================
// DRZEWA
// ============================================================




// ------------------------------------------------------------
// findInTree
// Szuka node'a po id — for bo chcemy przerwać gdy znajdziemy
// ------------------------------------------------------------
function findInTree(tree: TreeNode, id: number): TreeNode | undefined {
    if (tree.id === id) return tree

    for (const child of tree.children) {
        const result = findInTree(child, id)
        if (result) return result
    }

    return undefined
}

findInTree(tree, 4)   // { id:4, name:'c', children:[] }
findInTree(tree, 99)  // undefined


// ------------------------------------------------------------
// hasNode
// Sprawdza czy node z danym id istnieje
// ------------------------------------------------------------
function hasNode(tree: TreeNode, id: number): boolean {
    if (tree.id === id) return true
    for (const child of tree.children) {
        if (hasNode(child, id)) return true
    }
    return false
}

hasNode(tree, 4)   // true
hasNode(tree, 99)  // false


// ------------------------------------------------------------
// countNodes
// Liczy ile node'ów jest w drzewie
// 1 (siebie) + suma dzieci przez reduce
// ------------------------------------------------------------
function countNodes(tree: TreeNode): number {
    return 1 + tree.children.reduce((acc, item) => acc + countNodes(item), 0)
}

countNodes(tree)  // 4


// ------------------------------------------------------------
// sumTree
// Sumuje wszystkie id w drzewie
// ------------------------------------------------------------
function sumTree(tree: TreeNode): number {
    return tree.id + tree.children.reduce((acc, item) => acc + sumTree(item), 0)
}

sumTree(tree)  // 1+2+3+4 = 10


// ------------------------------------------------------------
// maxDepth
// Maksymalna głębokość drzewa
// map zbiera głębokości dzieci, Math.max(...depths) wybiera największą
// ------------------------------------------------------------
function maxDepth(tree: TreeNode): number {
    if (tree.children.length === 0) return 1
    const depths = tree.children.map(child => maxDepth(child))
    return 1 + Math.max(...depths)
}

maxDepth(tree2)  // 4 (root → b → c → d)


// ------------------------------------------------------------
// sumLeaves
// Sumuje id tylko leafów (node bez dzieci)
// base case zwraca tree.id — tylko leaf oddaje wartość
// ------------------------------------------------------------
function sumLeaves(tree: TreeNode): number {
    if (tree.children.length === 0) return tree.id
    return tree.children.reduce((acc, item) => acc + sumLeaves(item), 0)
}

sumLeaves(tree2)  // 2 + 5 = 7


// ------------------------------------------------------------
// getLeaves
// Zwraca wszystkie leaf node'y
// flatMap — każde wywołanie zwraca tablicę, flatMap skleja je w jedną
// base case zwraca [tree] — leaf w tablicy żeby flatMap mógł skleić
// ------------------------------------------------------------
function getLeaves(tree: TreeNode): TreeNode[] {
    if (tree.children.length === 0) return [tree]
    return tree.children.flatMap(child => getLeaves(child))
}

getLeaves(tree)  // [{ id:2 }, { id:4 }]


// ------------------------------------------------------------
// pathToNode
// Zwraca ścieżkę id od roota do szukanego node'a
// [tree.id, ...result] — dokłada siebie na POCZĄTEK bo wraca od dołu do góry
// ------------------------------------------------------------
function pathToNode(tree: TreeNode, id: number): number[] | undefined {
    if (tree.id === id) return [tree.id]
    if (tree.children.length === 0) return undefined

    for (const child of tree.children) {
        const result = pathToNode(child, id)
        if (result) return [tree.id, ...result]
    }
}

pathToNode(tree2, 5)   // [1, 3, 4, 5]
pathToNode(tree2, 99)  // undefined


// ------------------------------------------------------------
// collectValues
// Zbiera wartości danego pola ze WSZYSTKICH node'ów
// Każdy node dodaje siebie — bo chcemy każdy node, nie tylko leafy
// ------------------------------------------------------------
function collectValues(tree: TreeNode, field: keyof TreeNode): any[] {
    return [tree[field], ...tree.children.flatMap(child => collectValues(child, field))]
}

collectValues(tree, 'name')  // ['root', 'a', 'b', 'c']
collectValues(tree, 'id')    // [1, 2, 3, 4]


// ------------------------------------------------------------
// mapTree
// Przekształca każdy node przez fn
// ...fn(tree) — spread bo fn może zmienić children, nadpisujemy je swoją rekurencją
// ------------------------------------------------------------
function mapTree(tree: TreeNode, fn: (node: TreeNode) => TreeNode): TreeNode {
    return {
        ...fn(tree),
        children: tree.children.map(child => mapTree(child, fn))
    }
}

mapTree(tree, node => ({ ...node, id: node.id + 10 }))
// { id:11, children: [{ id:12 }, { id:13, children:[{ id:14 }] }] }


// ------------------------------------------------------------
// filterTree
// Usuwa node'y które nie spełniają warunku fn
// flatMap + ternary — pusta tablica [] znika po spłaszczeniu
// ------------------------------------------------------------
function filterTree(tree: TreeNode, fn: (node: TreeNode) => boolean): TreeNode | undefined {
    if (!fn(tree)) return undefined

    return {
        ...tree,
        children: tree.children.flatMap(child => {
            const result = filterTree(child, fn)
            return result ? [result] : []  // [] znika w flatMap ✅
        })
    }
}

filterTree(tree, node => node.id > 2)
// { id:3, children: [{ id:4 }] }


// ------------------------------------------------------------
// transformTree
// Dodaje pole depth do każdego node'a
// depth przekazywane jako argument — rośnie o 1 na każdym poziomie
// ------------------------------------------------------------
function transformTree(tree: TreeNode, depth: number = 0): TreeNodeWithDepth {
    return {
        ...tree,
        depth,
        children: tree.children.map(child => transformTree(child, depth + 1))
    }
}


// ------------------------------------------------------------
// mirrorTree
// Odwraca kolejność dzieci na każdym poziomie
// map (rekurencja w głąb) + reverse (odwrócenie na tym poziomie)
// ------------------------------------------------------------
function mirrorTree(tree: TreeNode): TreeNode {
    return {
        ...tree,
        children: tree.children.map(x => mirrorTree(x)).reverse()
    }
}


// ------------------------------------------------------------
// findDeepest
// Znajdź node który jest najgłębiej w drzewie
// map zbiera kandydatów, reduce wybiera najgłębszego przez maxDepth
// ------------------------------------------------------------
function findDeepest(tree: TreeNode): TreeNode {
    if (tree.children.length === 0) return tree
    const candidates = tree.children.map(el => findDeepest(el))
    return candidates.reduce((deepest, candidate) =>
        maxDepth(candidate) > maxDepth(deepest) ? candidate : deepest
    )
}

findDeepest(tree2)  // { id:5, name:'d', children:[] }


// ------------------------------------------------------------
// pruneTree
// Usuwa node'y z parzystym id
// [] dla parzystych znika po flatMap
// ------------------------------------------------------------
function pruneTree(tree: TreeNode): TreeNode | undefined {
    if (tree.id % 2 === 0) return undefined

    return {
        ...tree,
        children: tree.children.flatMap(child => {
            const result = pruneTree(child)
            return result ? [result] : []
        })
    }
}


// ------------------------------------------------------------
// zipTrees
// Łączy dwa drzewa sumując id odpowiadających sobie node'ów
// Zakłada że oba drzewa mają tę samą strukturę
// map z indeksem i — dopasowanie dzieci z obu drzew
// ------------------------------------------------------------
function zipTrees(a: TreeNode, b: TreeNode): TreeNode {
    return {
        ...a,
        id: a.id + b.id,
        children: a.children.map((child, i) => zipTrees(child, b.children[i]))
    }
}