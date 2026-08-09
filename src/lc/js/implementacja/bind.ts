function myBind<T extends (...args: any[]) => any>(
    fn: T,
    context: any,
    ...boundArgs: any[]
): (...args: any[]) => ReturnType<T> {
    return function (...callArgs: any[]) {
        return fn.apply(context, [...boundArgs, ...callArgs])
    }
}


// T = funkcja. Zwraca funkcję o tym samym typie zwracanym (ReturnType<T>). Typowanie
// bind na 100% poprawnie (z częściowymi argumentami) jest bardzo trudne w TS — na LC ta wersja wystarcza,
//     wspomnij że dokładne typowanie partial application jest złożone.