/* ============================================================================
 * CODE REVIEW — REACT / TYPESCRIPT
 * Ściąga: proces, checklista skanowania, typowe bugi, podchwytliwe wzorce.
 * ==========================================================================*/


/* ============================================================================
 * 1. PROCES — w tej kolejności
 * ==========================================================================*/

// KROK 0 (1-2 min)  Przeczytaj całość. Nie pisz nic.
//                   Co to ma robić? Jakie ma odpowiedzialności?
//                   Bez tego zgłosisz rzeczy wynikające z niezrozumienia.
//
// KROK 1  BUGI          → co się wywali / pokaże złe dane. Zawsze pierwsze.
// KROK 2  ARCHITEKTURA  → działa, ale kruche / źle zaprojektowane.
// KROK 3  DROBIAZGI     → nazwy, styl, drobne UX. Krótko, oznacz jako minor.
// KROK 4  NA PLUS       → jedno zdanie, co jest dobre. Review to nie egzekucja.
//
// ZASADY:
// - Zawsze mów DLACZEGO, nie tylko "źle".
//   ŹLE:    "key={i} jest złe"
//   DOBRZE: "key={i} przy filtrowanej liście skojarzy stan z niewłaściwym wierszem"
// - Dziel na "to jest bug" (bezdyskusyjne) i "to zależy od intencji" (pytaj, nie wyrokuj).
// - Nie flaguj preferencji stylistycznych jako błędów.
// - Nie musisz znaleźć wszystkiego. Ważniejsze: trafić w poważne i uzasadnić.


/* ============================================================================
 * 2. SZYBKI SKAN — 2 minuty, łapie ~80% typowych problemów
 * ==========================================================================*/

// [ ] każdy useEffect      → cleanup? deps kompletne? czy w ogóle potrzebny?
// [ ] każdy setState       → mutacja przed nim? powinien być updater?
// [ ] każdy .map() w JSX   → co jest kluczem?
// [ ] każdy fetch          → cleanup/abort? res.ok? obsługa błędu?
// [ ] każdy memo           → WSZYSTKIE propsy stabilne? (jeden niestabilny = memo martwe)
// [ ] każdy <form>         → preventDefault? walidacja? labelki?
// [ ] typy                 → jest gdzieś `any`? `{}`? brakujące uniony?
// [ ] a11y                 → inputy mają label/aria-label? przyciski mają nazwę?


/* ============================================================================
 * 3. TYPOWE BUGI
 * ==========================================================================*/


/* --- 3.1 MUTACJA STANU — najczęstszy i najgroźniejszy -----------------------
 * React wykrywa zmiany przez REFERENCJĘ (Object.is), nie zawartość.
 * Mutacja = ta sama referencja = brak re-renderu. Dane nowe, ekran stary.
 */

// ŹLE
const handleChangeBad = (field: string, value: unknown) => {
    // settings[field] = value      // mutacja w miejscu
    // setSettings(settings)        // ta sama referencja -> React nic nie widzi
}

// DOBRZE
const handleChangeGood = (field: string, value: unknown) => {
    // setSettings(prev => ({ ...prev, [field]: value }))
}

// METODY MUTUJĄCE (psują referencję):  push pop shift unshift splice sort reverse
// METODY NIEMUTUJĄCE (zwracają nową):  map filter slice concat flat toSorted toReversed
//
// PUŁAPKA: .sort() mutuje ORAZ zwraca tę samą tablicę.
//   setSorted(items.sort(...))        // mutacja stanu + ta sama ref -> brak renderu
//   setSorted([...items].sort(...))   // OK
//
// GDZIE MUTACJA JEST OK:
//   - lokalna zmienna PRZED setState (const next = {...s}; next.x = 1; setState(next))
//   - refy (ref.current = x) — są od tego
//   - Immer / Redux Toolkit (to proxy, nie prawdziwa mutacja)


/* --- 3.2 STALE CLOSURE ------------------------------------------------------
 * Funkcja "zamraża" zmienne z renderu, w którym powstała.
 * Objawy: licznik stoi na 1, timeout używa starej wartości, interval nie widzi zmian.
 */

// ŹLE
// setCount(count + 1)
// setCount(count + 1)          // oba czytają TO SAMO count -> +1, nie +2
//
// setInterval(() => setCount(count + 1), 1000)     // count zamrożony -> zawsze 1
// setTimeout(() => setCount(count + 1), 2000)      // count z chwili odpalenia

// DOBRZE — updater dostaje świeży stan od Reacta, nie z domknięcia
// setCount(prev => prev + 1)
//
// REGUŁA: nowy stan zależy od starego -> updater.
//         nowy stan niezależny (setText(e.target.value)) -> wartość wprost.


/* --- 3.3 BRAK CLEANUPU W useEffect -----------------------------------------
 * Objawy: wycieki, wiele listenerów/timerów naraz, setState po unmount,
 *         "debounce", który wcale nie debounce'uje.
 */

// ŹLE — każda zmiana planuje WŁASNY timeout, żaden nie kasowany
// useEffect(() => {
//   const t = setTimeout(() => autoSave(), 2000)
// }, [settings])                      // 20 znaków = 20 requestów

// DOBRZE
// useEffect(() => {
//   const t = setTimeout(() => autoSave(), 2000)
//   return () => clearTimeout(t)      // cleanup kasuje poprzedni -> RESET odliczania
// }, [settings])

// Cleanup potrzebny przy: setTimeout, setInterval, addEventListener,
//                         subskrypcje, WebSocket, AbortController, observery


/* --- 3.4 RACE CONDITION W FETCHU -------------------------------------------
 * Szybka zmiana parametru -> odpowiedzi wracają w złej kolejności ->
 * stary request nadpisuje nowsze dane.
 */

// DOBRZE
// useEffect(() => {
//   const controller = new AbortController()
//   const run = async () => {
//     setLoading(true); setError("")
//     try {
//       const res = await fetch(url, { signal: controller.signal })
//       if (!res.ok) throw new Error(`HTTP ${res.status}`)   // fetch NIE rzuca na 404/500
//       setData(await res.json())
//     } catch (err) {
//       if (err instanceof Error && err.name === "AbortError") return
//       setError(err instanceof Error ? err.message : "Coś poszło nie tak")
//     } finally {
//       if (!controller.signal.aborted) setLoading(false)
//     }
//   }
//   run()
//   return () => controller.abort()    // cleanup: anuluj stary request
// }, [url])
//
// Alternatywa: flaga `let ignore = false` + `return () => { ignore = true }`
//   — prostsze, ale NIE anuluje requestu (leci do końca, wynik ignorowany).
//
// UWAGA: callback useEffect nie może być async (musi zwracać cleanup albo nic).
//        Stąd wewnętrzna funkcja async + wywołanie.


/* --- 3.5 key={index} -------------------------------------------------------
 * Przy sortowaniu/filtrowaniu/usuwaniu indeksy się przesuwają.
 * React kojarzy element z niewłaściwymi danymi -> stan inputów/checkboxów
 * zostaje przy złym wierszu.
 */

// ŹLE:     items.map((item, i) => <Row key={i} ... />)
// DOBRZE:  items.map((item)    => <Row key={item.id} ... />)
//
// key={i} jest akceptowalne TYLKO gdy lista jest statyczna
// (nigdy nie sortowana, filtrowana, ani nie zmienia kolejności).


/* --- 3.6 STAN POCHODNY (useState + useEffect zamiast liczenia w renderze) ---
 * Jeśli wartość DA SIĘ POLICZYĆ z innego stanu/propsów — licz w renderze.
 */

// ŹLE
// const [sorted, setSorted] = useState([])
// useEffect(() => { setSorted([...items].sort(fn)) }, [items, sortBy])
//
// const [total, setTotal] = useState(0)
// useEffect(() => { setTotal(items.reduce(...)) }, [items])

// DOBRZE
// const sorted = [...items].sort(fn)
// const total  = items.reduce((sum, i) => sum + i.price, 0)

// DLACZEGO wersja z efektem jest gorsza:
//  1. dodatkowy render (efekt leci PO renderze i woła setState)
//  2. jeden render z nieaktualnymi danymi (stan "w połowie zsynchronizowany")
//  3. dwa źródła prawdy -> ryzyko rozjazdu
//  4. więcej kodu
//
// Wyjątek: obliczenie NAPRAWDĘ drogie -> useMemo (nie osobny stan).


/* --- 3.7 SYNCHRONIZACJA STANU Z PROPSEM ------------------------------------
 * useEffect(() => setState(prop), [prop]) — prawie zawsze podejrzane.
 */

// PROBLEMY:
//  - nadpisuje niezapisane zmiany usera
//  - jeśli rodzic tworzy prop inline ({{...}}) -> nowy obiekt co render ->
//    efekt odpala się co render -> formularz kasuje się na bieżąco
//  - dodatkowy render
//
// LEPSZE ROZWIĄZANIE (gdy chodzi o "reset przy zmianie encji"):
//   <Form key={userId} ... />        // zmiana key = remount = świeży stan
//
// TO MOŻE BYĆ CELOWE — zapytaj autora o intencję. Ale nawet wtedy `key` jest czystsze.


/* --- 3.8 memo BEZ useCallback = memo MARTWE --------------------------------
 * memo porównuje KAŻDY prop płytko. Jeden niestabilny prop -> memo nic nie daje.
 */

// ŹLE
// const style = { padding: 8 }                 // nowy obiekt co render
// const handleClick = (id) => {...}            // nowa funkcja co render
// <Row memoized style={style} onClick={handleClick} />   // memo pęka na obu

// DOBRZE
// const handleClick = useCallback((id) => {...}, [])
// const STYLE = { padding: 8 }                 // POZA komponentem (stała)

// CO JEST NOWE CO RENDER:  obiekty, tablice, funkcje tworzone w ciele komponentu
// CO JEST STABILNE:        stan, refy, propsy (dopóki rodzic ich nie zmieni),
//                          stałe poza komponentem
//
// UWAGA: memo działa TYLKO gdy wszystkie propsy stabilne. Naprawa jednego
//        bez drugiego nic nie da — a może ODSŁONIĆ ukryty bug z mutacją.


/* --- 3.9 NIESTABILNE REFERENCJE W DEPS -> PĘTLA ----------------------------
 */

// ŹLE — nieskończona pętla
// const options = { headers: {...} }           // nowy obiekt co render
// useEffect(() => { fetch(url, options) }, [url, options])
//   render -> nowy options -> deps zmienione -> efekt -> setState -> render -> ...

// DOBRZE
//  - nie zależy od niczego z komponentu -> wynieś POZA komponent
//  - zależy od czegoś                   -> useMemo
//  - albo po prostu wstaw obiekt inline w fetch i usuń z deps


/* --- 3.10 FORMULARZE -------------------------------------------------------
 */

// [ ] onSubmit na <form>, nie onClick na <button>  (Enter + a11y)
// [ ] e.preventDefault()                            (bez tego PRZEŁADOWANIE strony)
// [ ] noValidate na <form> przy własnej walidacji   (natywna blokuje submit, psuje testy)
// [ ] blokada double-submit przez useRef (setState jest odroczony — guard
//     na state.isLoading przepuści drugi klik w oknie przed re-renderem)
// [ ] każdy input ma <label htmlFor> albo aria-label
// [ ] walidacja też przed autozapisem, nie tylko przy submit


/* --- 3.11 FETCH — checklist ------------------------------------------------
 */

// [ ] res.ok              (fetch NIE rzuca na 404/500 — tylko na błąd sieci)
// [ ] catch + komunikat
// [ ] AbortError odfiltrowany
// [ ] cleanup / abort
// [ ] guard na `data` przed renderem (data może być undefined/null)
// [ ] loading NIE zastępuje całego UI, jeśli to psuje layout
//     (np. paginacja znikająca podczas ładowania — przyciski uciekają spod kursora)


/* ============================================================================
 * 4. PODCHWYTLIWE — wygląda OK, nie jest
 * ==========================================================================*/

// [!] .sort() / .reverse() — mutują ORAZ zwracają tę samą referencję.
//     Podwójny bug: mutacja stanu + setState bez zmiany referencji.

// [!] {} jest TRUTHY — `if (errors)` zawsze true.
//     Sprawdzaj: Object.keys(errors).length > 0

// [!] Object.keys liczy KLUCZE, nie wartości.
//     { email: undefined } ma length 1. Czyszczenie przez `undefined` nie usuwa klucza.
//     Do sprawdzenia "czy są jakieś błędy": Object.values(errors).some(Boolean)

// [!] {cond && "klasa"} — gdy cond jest false, React renderuje string "false".
//     Używaj: {cond ? "klasa" : ""}

// [!] ?? vs && w JSX
//     ?? to fallback dla null/undefined (dla WARTOŚCI, nie JSX)
//     && to warunkowe renderowanie
//     `{error ?? <Pagination/>}` — błąd, "" nie jest nullish -> nigdy nie renderuje

// [!] {items.length && <List/>} — gdy length === 0, renderuje "0" na ekranie.
//     Używaj: {items.length > 0 && <List/>}

// [!] {...tablica} w klamrach daje OBIEKT ({0: a, 1: b}), nie tablicę.
//     Kopia tablicy to [...tablica]

// [!] catch (err) daje `unknown` (TS 4.4+) — wymaga instanceof Error.
//     .catch(err => ...) daje `any` — TS nie zmusza, ale i tak zawężaj.

// [!] async function ZAWSZE zwraca Promise. `return 5` -> Promise<number>.
//     `return` bez wartości -> Promise<void> (czyli rozwiązany z undefined).

// [!] res.json() też zwraca Promise — stąd DWA await:
//     const res = await fetch(url); const data = await res.json()

// [!] useState<T>() bez wartości -> typ T | undefined. Guard przed użyciem.

// [!] return [value, setValue] z hooka BEZ `as const` -> TS widzi tablicę unii,
//     destrukturyzacja rozjeżdża typy, setter "nie jest wywoływalny".
//     Zawsze: return [value, setValue] as const

// [!] Łańcuch efektów (efekt A zmienia stan -> efekt B reaguje) daje render,
//     w którym stan jest "w połowie zaktualizowany" -> migotanie starych danych.
//     Np. useDebounce -> zmiana url -> useFetch: isPending gaśnie o render
//     ZANIM loading się zapali.

// [!] onMouseLeave na KAŻDYM elemencie listy powoduje migotanie przy przechodzeniu
//     między nimi. Enter na elementach, leave na KONTENERZE.

// [!] Efekty odpalają się PO renderze. setOpen(false) w useEffect zdąży o jedną
//     klatkę za późno — jeśli musi być natychmiast, rób to w handlerze (synchronicznie).


/* ============================================================================
 * 5. ZALEŻY OD INTENCJI — pytaj, nie wyrokuj
 * ==========================================================================*/

// - useEffect synchronizujący stan z propsem (może być celowy reset)
// - brak memo/useCallback (może być świadome: "nie optymalizuj bez pomiaru")
// - stan globalny vs lokalny (zależy od reszty apki)
// - własny hook vs biblioteka (React Query, RHF — zależy od skali projektu)
// - virtualizacja (ma realne koszty: SEO, a11y, zmienne wysokości)
//
// FORMUŁA:
// "Jeśli to celowe (X), to OK, ale zrobiłbym Y. Jeśli nie — to bug, bo Z.
//  Zapytałbym autora o intencję."


/* ============================================================================
 * 6. TYPESCRIPT
 * ==========================================================================*/

// [ ] any                     -> konkretny typ albo unknown + zawężenie
// [ ] {} jako typ             -> Record<string, string> / Partial<Record<K, V>>
// [ ] string zamiast unionu   -> "light" | "dark", nie string
// [ ] props: any              -> nazwany typ
// [ ] brak typu zwrotu reducera -> jawne `: State` łapie brak return / zły kształt
// [ ] as-casty                -> czy uzasadnione? (as any = wyłączenie kontroli)
//
// PRZYDATNE:
//   Todo["id"]                      indexed access — jedno źródło prawdy
//   Partial<Record<keyof T, string>> mapa błędów formularza
//   keyof T                          klucze typu
//   Discriminated union na akcje:    { type: "ADD"; payload: X } | { type: "CLEAR" }


/* ============================================================================
 * 7. A11Y — szybki przegląd
 * ==========================================================================*/

// [ ] inputy mają <label htmlFor> albo aria-label
// [ ] przyciski ikonowe / puste mają aria-label
//     (bonus: robi je testowalnymi — getByRole("button", { name: "..." }))
// [ ] <li> wewnątrz <ul>/<ol>
// [ ] komunikaty błędów: role="alert"
// [ ] stan wyrażony semantycznie (aria-pressed, aria-invalid, aria-expanded),
//     nie tylko klasą CSS — inaczej test musi sprawdzać className
// [ ] nawigacja klawiaturą tam, gdzie jest to oczekiwane
//     (dropdown/autocomplete: strzałki, Enter, Escape)


/* ============================================================================
 * 8. JAK TO POWIEDZIEĆ NA ROZMOWIE
 * ==========================================================================*/

// "Przeczytałem — to [X]. Zacznę od rzeczy, które uważam za bugi,
//  potem kwestie projektowe, na końcu drobiazgi.
//
//  BUGI:        [3-4 najpoważniejsze, każdy z uzasadnieniem]
//  PROJEKTOWO:  [stan pochodny, martwe memo, struktura]
//  DROBIAZGI:   [szybko, jednym tchem, oznaczone jako minor]
//  NA PLUS:     [jedna rzecz, która jest dobra]
//  DO USTALENIA: [co zależy od intencji — zapytałbym autora]"
//
// Sama ta struktura robi dobre wrażenie: pokazuje priorytetyzację,
// a nie wypisywanie wszystkiego jak leci.


/* ============================================================================
 * 9. NAJCZĘSTSZE BUGI — TL;DR (od najczęstszego)
 * ==========================================================================*/

//  1. mutacja stanu                     -> UI się nie aktualizuje
//  2. brak cleanupu w useEffect         -> wycieki, wielokrotne requesty, brak debounce
//  3. stale closure                     -> stara wartość w timerze/handlerze
//  4. key={index}                       -> stan przy złym wierszu
//  5. stan pochodny w useState+useEffect-> dodatkowe rendery, rozjazd danych
//  6. brak res.ok                       -> 404 przechodzi jako sukces
//  7. race condition (brak abortu)      -> stare dane nadpisują nowe
//  8. memo bez useCallback              -> optymalizacja, która nic nie robi
//  9. brak preventDefault w formularzu  -> przeładowanie strony
// 10. niestabilny obiekt w deps         -> nieskończona pętla

export {}