// Co wypisze i dlaczego?

console.log('1')

setTimeout(() => console.log('2'), 0)

Promise.resolve().then(() => console.log('3'))

console.log('4')

// 1,4,3,2


console.log('1')

setTimeout(() => {
    console.log('2')
    Promise.resolve().then(() => console.log('3'))
}, 0)

Promise.resolve()
    .then(() => {
        console.log('4')
        setTimeout(() => console.log('5'), 0)
    })
    .then(() => console.log('6'))

console.log('7')


// 1,7, 4,6,5,2,3

// 1,7 bo to sync
// potem pmijam timeout bo to maktotask (ddaje do kolejki makrotask) patrze na promse
// biore od 1szego then, log 4 bo sync, timeout dodaje od makro
// then kolejny zwraca 6
// potem 1szy maktotask, zwraca 2,3 a na koncu 2gi makrto czyli 5


 async function foo() {
    console.log('1')
    await Promise.resolve()
    console.log('2')
}

console.log('3')
foo()
console.log('4')

//3,1,4,2

// 3 — sync
// foo() odpala się:
//   1 — sync wewnątrz foo
//   await — zawiesza foo, reszta foo trafia do microtasków
// 4 — sync (call stack wraca do głównego kodu)
// microtaski:
//   2 — z zawieszonego foo


async function a() {
    console.log('1')
    await b()
    console.log('2')
}

async function b() {
    console.log('3')
    await Promise.resolve()
    console.log('4')
}

console.log('5')
a()
console.log('6')

// 5, 1, 3, 6, 4, 2

//5
//a() pisze 1 reszta microtask jestesmy w b
// 3 reszta microtask
//6
//eraz microtaski b i a- 4,2



console.log('start')

setTimeout(() => console.log('timeout 1'), 0)

Promise.resolve()
    .then(() => {
        console.log('micro 1')
        setTimeout(() => console.log('timeout 2'), 0)
        return Promise.resolve()
    })
    .then(() => console.log('micro 2'))

setTimeout(() => console.log('timeout 3'), 0)

console.log('end')

//start, end, micro 1, micro 2, timeout 1, timeout 3, timeout 2


// start — sync
// setTimeout(timeout 1) — dodaje do makrotasków: [t1]
// Promise.resolve().then — dodaje do mikrotasków: [micro1]
// setTimeout(timeout 3) — dodaje do makrotasków: [t1, t3]
// end — sync

// mikrotaski:
//   micro 1 — wykonuje się
//     setTimeout(timeout 2) — dodaje do makrotasków: [t1, t3, t2]
//     return Promise.resolve() — dodaje kolejny then do mikrotasków: [micro2]
//   micro 2 — wykonuje się

// makrotaski po kolei:
//   timeout 1
//   timeout 3
//   timeout 2



new Promise((resolve) => {
    console.log('1')
    resolve()
    console.log('2')
}).then(() => console.log('3'))

console.log('4')


//resolve sync - to co w then micro

//1,2,4,3?


Promise.resolve()
    .then(() => {
        console.log('1')
        return new Promise((resolve) => {
            console.log('2')
            resolve()
        })
    })
    .then(() => console.log('3'))

console.log('4')

//4,1,2,3


setTimeout(() => console.log('1'), 0)
setTimeout(() => console.log('2'), 1)

Promise.resolve()
    .then(() => console.log('3'))
    .then(() => console.log('4'))


// 3,4,1,2



console.log('1')

queueMicrotask(() => console.log('2'))

Promise.resolve().then(() => console.log('3'))

queueMicrotask(() => console.log('4'))

console.log('5')


//1,5,2,3,4


console.log('1')

queueMicrotask(() => {
    console.log('2')
    queueMicrotask(() => console.log('3'))
})

Promise.resolve()
    .then(() => console.log('4'))
    .then(() => console.log('5'))

console.log('6')


//1, 6,2,4,3,5




console.log('1')

setTimeout(() => {
    console.log('2')
    queueMicrotask(() => console.log('3'))
    Promise.resolve().then(() => console.log('4'))
}, 0)

queueMicrotask(() => console.log('5'))

console.log('6')


//1,6,5,2,3,4


async function foo2() {
    console.log('1')
    await null
    console.log('2')
    await null
    console.log('3')
}

console.log('4')
foo()
console.log('5')

Promise.resolve()
    .then(() => console.log('6'))
    .then(() => console.log('7'))


//4, 1, 5, 2, 6, 3, 7

// 4 — sync
// foo() → log 1, await → kolejka: [await1]
// 5 — sync
// Promise.then(6) → kolejka: [await1, then6]

// wykonuję await1 → log 2, await2 → kolejka: [then6, await2]
// wykonuję then6 → log 6, dodaje then7 → kolejka: [await2, then7]
// wykonuję await2 → log 3 → kolejka: [then7]
// wykonuję then7 → log 7





async function a() {
    console.log('1')
    await b()
    console.log('2')
}

async function b() {
    console.log('3')
    await c()
    console.log('4')
}

async function c() {
    console.log('5')
    await null
    console.log('6')
}

console.log('7')
a()
console.log('8')



//7,1, 3,5,8,6,4,2



async function foo() {
    const result = await Promise.all([
        Promise.resolve('a'),
        Promise.resolve('b'),
        Promise.resolve('c'),
    ])
    console.log(result)
}

console.log('1')
foo()
console.log('2')


//1,2,result



async function foo3() {
    console.log('1')

    await Promise.resolve()
    console.log('2')

    await Promise.resolve()
    console.log('3')
}

async function bar() {
    console.log('4')

    await Promise.resolve()
    console.log('5')
}

foo()
bar()
console.log('6')

//1,4,6,2,5,3


async function foo() {
    console.log('1')
    await Promise.resolve()
    console.log('2')
}

async function bar() {
    console.log('3')
    await foo()
    console.log('4')
}

bar()
console.log('5')


//3,1,5,2,4



console.log('1')

setTimeout(() => console.log('2'), 0)

async function foo() {
    await Promise.resolve()
    console.log('3')
    await Promise.resolve()
    console.log('4')
}

Promise.resolve().then(() => {
    foo()
    console.log('5')
})

console.log('6')



//1, 6, 5,3,4,2

//1, makrotask
// .then w m1,6
// m1- foo() micro na 3, wraca do 5, potem wraca do 3, dodaj m z 4ka, wraca do 4ki, na koniec makro





async function foo() {
    console.log('1')
    await bar()
    console.log('2')
    return '3'
}

async function bar() {
    console.log('4')
}

foo().then(result => console.log(result))
console.log('5')

//1,4,5,2,3

// 1, idziemy do bar resze micro-
// 4, wracamy.5. 2.3




async function foo() {
    try {
        await Promise.reject(new Error('błąd'))
        console.log('1')
    } catch (e) {
        console.log('2')
        await Promise.resolve()
        console.log('3')
    }
}

console.log('4')
foo()
console.log('5')


// 4,5, blad,  2,3



Promise.resolve()
    .then(() => {
        throw new Error('błąd')
    })
    .then(() => console.log('1'))
    .catch(() => console.log('2'))
    .then(() => console.log('3'))

console.log('4')


//4, blad,2,3




async function foo() {
    console.log('1')

    const [a, b] = await Promise.all([
        Promise.resolve('a').then(() => {
            console.log('2')
            return 'a'
        }),
        Promise.resolve('b').then(() => {
            console.log('3')
            return 'b'
        })
    ])

    console.log('4', a, b)
}

console.log('5')
foo()
console.log('6')


//5, 1, 6, 2, 3, 4, a, b

//5, 1, potem 1then micro,2then micro, console.log('4', a, b) micro3, 6, 2,3, 4,a,b




console.log('1')

setTimeout(() => {
    console.log('2')
    Promise.resolve().then(() => console.log('3'))
}, 0)

setTimeout(() => {
    console.log('4')
    Promise.resolve().then(() => console.log('5'))
}, 0)

Promise.resolve()
    .then(() => setTimeout(() => console.log('6'), 0))
    .then(() => console.log('7'))

console.log('8')

  //1, 8, 7, 2, 3, 4, 5, 6



async function foo() {
    console.log('1')
    await Promise.resolve()
    console.log('2')
    await Promise.resolve()
    console.log('3')
}

async function bar() {
    console.log('4')
    await Promise.resolve()
    console.log('5')
    await Promise.resolve()
    console.log('6')
}

foo()
bar()
console.log('7')



// 1,4,7,2,5,3,6



console.log('1')

async function foo() {
    console.log('2')
    await null
    console.log('3')
    await null
    console.log('4')
}

queueMicrotask(() => {
    console.log('5')
    queueMicrotask(() => console.log('6'))
})

foo()
console.log('7')


//1, 2, 7, 5, 3, 6, 4

//1, m1- body qm
// 2, m2-w foo, 7
// m1- log 5, m3-qm
// 3,6,4



console.log('1')

setTimeout(() => console.log('2'), 0)

new Promise((resolve) => {
    console.log('3')
    setTimeout(() => resolve('4'), 0)
}).then(val => console.log(val))

console.log('5')

// 1, 3, 5,2,4




async function foo() {
    console.log('1')

    await new Promise((resolve) => {
        console.log('2')
        resolve()
    })

    console.log('3')
}

console.log('4')
foo()
console.log('5')


//nawet jak await promsie to ja nie ma then to jest traktowane jako sync
//4,1,2,5,3



console.log('1')

async function foo() {
    await Promise.resolve()
    console.log('2')
}

async function bar() {
    await foo()
    console.log('3')
}

bar()

Promise.resolve().then(() => console.log('4'))

console.log('5')

//1, 5, 2, 3, 4



console.log('1')


setTimeout(() => {
    console.log('2')
    Promise.resolve().then(() => console.log('3'))
}, 0)

async function foo() {
    await Promise.resolve()
    console.log('4')
    await Promise.resolve()
    console.log('5')
}

Promise.resolve().then(() => {

    console.log('6')
    foo()
}).then(() => console.log('7'))

console.log('8')


//1, 8, 6, 4, 7, 5, 2, 3

// 1, 1then - m1
//8
//1 ,8, 6, pierwszy await do m2, then-2 m-3
// 4, m4,7,5,2,3


console.log('1')

queueMicrotask(async () => {
    console.log('2')
    await Promise.resolve()
    console.log('3')
})

async function foo() {
    console.log('4')
    await null
    console.log('5')

Promise.resolve().then(foo)

console.log('6')

//1, 6, 2, 4, 3, 5

// 1, queue -m1, then-m2, 6
// po log6 wracam do m1 czyli log 2 i nowy m3
// teraz ide do m2 czyli wykonuje foo log 4, m4 po await
// teraz wracam do m3 z queue microtask
// log3, przejscie do m4 log 5



console.log('1')

setTimeout(() => console.log('2'), 0)

Promise.resolve()
    .then(() => {
        console.log('3')
        return Promise.resolve('4')
    })
    .then(val => console.log(val))

console.log('5')

// 1, 5, 3, 4, 2.


console.log('1')

Promise.resolve()
    .then(() => Promise.resolve('2'))
    .then(val => console.log(val))

Promise.resolve()
    .then(() => console.log('3'))
    .then(() => console.log('4'))

console.log('5')



//1, 5, 3, 4, 2



const urls = ['url1', 'url2', 'url3']

// wersja 1
async function sequential() {
    for (const url of urls) {
        const result = await fetch(url)
        console.log(result)
    }
}

// wersja 2
async function parallel() {
    const results = await Promise.all(urls.map(url => fetch(url)))
    console.log(results)
}




















