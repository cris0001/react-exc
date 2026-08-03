// ===== THIS / CALL / APPLY / BIND =====

// 1. this zależy od tego co przed kropką
obj.method()     // this = obj
method()         // this = undefined (strict) / window
new Method()     // this = nowy obiekt

// 2. arrow function NIE ma własnego this
// dziedziczy z zewnętrznego scope w momencie definicji
// kopiowanie referencji nie zmienia this

// 3. call / apply / bind — ręczne ustawienie this
fn.call(obj, arg1, arg2)       // wywołuje od razu, args po przecinku
fn.apply(obj, [arg1, arg2])    // wywołuje od razu, args w tablicy
fn.bind(obj, arg1)             // zwraca nową funkcję, nie wywołuje

// 4. bind ustawia this na stałe — nie można nadpisać przez call/apply/bind

// 5. setTimeout callback — zwykła funkcja gubi this
setTimeout(function() { this.x }) // this = undefined
setTimeout(() => { this.x })      // this z zewnętrznego scope ✅

// 6. klasy — naprawianie this
class Foo {
    // opcja 1 — arrow field
    method = () => { this.x }

    // opcja 2 — bind w konstruktorze
    constructor() {
        this.method = this.method.bind(this)
    }
}

// 7. kopiowanie metody gubi this
const fn = obj.method        // gubi this ❌
const fn = obj.method.bind(obj) // zachowuje this ✅