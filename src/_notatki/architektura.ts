/* ============================================================================
 * ARCHITEKTURA APLIKACJI REACT — ŚCIĄGA
 * Jak planować, gdzie co trzymać, czym się uzasadniać na rozmowie.
 * ==========================================================================*/


/* ============================================================================
 * 0. JAK ODPOWIADAĆ NA PYTANIA ARCHITEKTONICZNE
 * ==========================================================================*/

// Pytanie "jak byś zorganizował aplikację X" NIE MA jednej dobrej odpowiedzi.
// Oceniają, czy potrafisz uzasadnić wybór i widzisz trade-offy.
//
// SCHEMAT ODPOWIEDZI:
//   1. Dopytaj o skalę        "Ile osób w zespole? Jak duża apka? Jak długo żyje?"
//   2. Podaj domyślne         "Zacząłbym od najprostszego: X"
//   3. Powiedz, co by zmieniło zdanie  "Gdyby doszło Y, przeszedłbym na Z"
//   4. Nazwij koszt           "Kosztem jest to, że..."
//
// CZERWONA FLAGA U KANDYDATA: od razu wymienia 8 bibliotek i wzorzec CQRS.
// ZIELONA FLAGA: "zacznę prosto, dołożę gdy zaboli — i wiem, kiedy zaboli".
//
// ZŁOTA ZASADA: architektura to ODRACZANIE decyzji, nie podejmowanie wszystkich
// na starcie. Najlepsza struktura to taka, którą łatwo zmienić.


/* ============================================================================
 * 1. RODZAJE STANU — NAJWAŻNIEJSZA KLASYFIKACJA
 * ==========================================================================*/

// Większość złych decyzji architektonicznych to wrzucenie wszystkiego
// do jednego worka ("globalny store"). Stan ma RÓŻNE RODZAJE i różne narzędzia.

// ┌─────────────────┬────────────────────────────┬──────────────────────────┐
// │ RODZAJ          │ PRZYKŁADY                  │ NARZĘDZIE                │
// ├─────────────────┼────────────────────────────┼──────────────────────────┤
// │ SERVER STATE    │ lista userów, post, koszyk │ React Query / SWR        │
// │                 │ z backendu                 │                          │
// ├─────────────────┼────────────────────────────┼──────────────────────────┤
// │ URL STATE       │ filtry, paginacja, search, │ searchParams / router    │
// │                 │ wybrana zakładka           │                          │
// ├─────────────────┼────────────────────────────┼──────────────────────────┤
// │ CLIENT / UI     │ modal otwarty, sidebar,    │ useState (lokalnie)      │
// │ STATE           │ hover, wybrany element     │ Zustand (globalnie)      │
// ├─────────────────┼────────────────────────────┼──────────────────────────┤
// │ FORM STATE      │ wartości pól, błędy, dirty │ useState / useReducer    │
// │                 │                            │ React Hook Form (duże)   │
// ├─────────────────┼────────────────────────────┼──────────────────────────┤
// │ STAŁE GLOBALNE  │ theme, locale, zalogowany  │ Context (rzadkie zmiany) │
// │                 │ user                       │                          │
// ├─────────────────┼────────────────────────────┼──────────────────────────┤
// │ DERIVED         │ suma koszyka, lista po     │ NIC — licz w renderze    │
// │ (pochodny)      │ filtrze, licznik           │ (useMemo tylko gdy drogie)│
// └─────────────────┴────────────────────────────┴──────────────────────────┘

// NAJCZĘSTSZY BŁĄD: trzymanie server state w Reduxie/Zustandzie.
// Wtedy sam piszesz cache, invalidację, refetch, deduplikację, retry —
// czyli odtwarzasz React Query, tylko gorzej.
//
// DRUGI NAJCZĘSTSZY: derived state w useState + useEffect.
// (patrz: code-review-checklist, sekcja 3.6)
//
// TRZECI: filtry i paginacja w useState zamiast w URL.
// Skutek: user nie może wysłać linku ani odświeżyć strony bez utraty widoku.


/* ============================================================================
 * 2. DRABINA STANU — od najprostszego, w górę tylko gdy trzeba
 * ==========================================================================*/

//  1. useState w komponencie
//        ↓ dwa-trzy komponenty potrzebują tego samego
//  2. lifting state up (przenieś do wspólnego rodzica)
//        ↓ przekazujesz przez 3+ poziomy, których to nie obchodzi (prop drilling)
//  3. Context (dla rzadko zmieniających się rzeczy)
//     albo composition — <Layout sidebar={<Sidebar/>}/> zamiast przekazywania propsów
//        ↓ globalny stan zmieniający się CZĘSTO, wielu konsumentów
//  4. Zustand / Jotai
//        ↓ złożone przepływy, time-travel debugging, duży zespół z konwencją
//  5. Redux Toolkit
//
// Osobna ścieżka dla danych z serwera:  React Query / SWR (od razu, nie po drabinie)
//
// NIE PRZESKAKUJ SZCZEBLI "na zapas". Przejście 1 → 4 to godzina roboty,
// a przedwczesny globalny store to koszt na cały czas życia projektu.


/* ============================================================================
 * 3. CONTEXT vs ZUSTAND vs REDUX — kiedy co
 * ==========================================================================*/

/* --- CONTEXT ---------------------------------------------------------------
 * DO CZEGO: rzadko zmieniające się wartości globalne.
 *   theme, locale/i18n, zalogowany user, feature flags, konfiguracja
 *
 * PLUS:  wbudowany, zero zależności, prosty
 * MINUS: KAŻDY konsument re-renderuje się przy zmianie wartości.
 *        Brak selektorów — nie subskrybujesz "kawałka" stanu.
 *        Wiele providerów = piramida zagnieżdżeń.
 *
 * PUŁAPKA: value={{ a, b }} tworzy nowy obiekt co render -> wszyscy konsumenci
 *          renderują się przy KAŻDYM renderze providera. Owiń w useMemo
 *          albo rozdziel na dwa konteksty (stan / dispatch).
 *
 * NIE UŻYWAJ do: danych z serwera, stanu zmieniającego się co sekundę,
 *                dużych obiektów z wieloma niezależnymi konsumentami.
 */

// WZORZEC: createContext(undefined) + guarded hook
// (pełny kod niżej, sekcja 8)

/* --- ZUSTAND ---------------------------------------------------------------
 * DO CZEGO: globalny CLIENT state, który zmienia się często
 *   koszyk, otwarte modale, stan edytora, filtry UI, wizard multi-step
 *
 * PLUS:  selektory (subskrybujesz kawałek -> tylko zainteresowani renderują),
 *        brak providera, mało boilerplate'u, działa poza Reactem
 * MINUS: kolejna zależność, łatwo wrzucić za dużo do jednego store'a
 *
 * DZIŚ DOMYŚLNY WYBÓR dla globalnego client state w nowych projektach.
 */

/* --- REDUX (Toolkit) -------------------------------------------------------
 * DO CZEGO: duże aplikacje, duże zespoły, potrzeba ścisłej konwencji,
 *           DevTools z time-travel, złożone przepływy akcji, middleware
 *
 * PLUS:  ekosystem, DevTools, wymuszona struktura, wszyscy to znają
 * MINUS: najwięcej boilerplate'u (nawet z RTK), stroma krzywa dla nowych
 *
 * REALIA 2026: rzadko wybierany do NOWYCH projektów, ale ISTNIEJE w mnóstwie
 * apek — więc trzeba go znać. Dziś: createSlice + Immer, nie stary Redux.
 *
 * Redux ≠ server state. RTK Query istnieje, ale React Query jest popularniejsze.
 */

/* --- REACT QUERY / TanStack Query ------------------------------------------
 * DO CZEGO: WSZYSTKO, co przychodzi z serwera.
 *
 * DAJE ZA DARMO: cache, deduplikacja requestów, refetch on focus/reconnect,
 *   stale-while-revalidate, retry, loading/error states, keepPreviousData
 *   (płynna paginacja), infinite queries, optimistic updates, invalidację.
 *
 * queryKey wiąże dane z zapytaniem — dlatego nie da się pokazać danych
 * z poprzedniego zapytania (problem, który przy ręcznym useFetch trzeba
 * rozwiązywać znacznikiem "dla którego url są te dane").
 *
 * NA ROZMOWIE: umiej napisać useFetch ręcznie (mechanizmy: abort, race,
 * cleanup) ORAZ powiedzieć, że w produkcji użyłbyś React Query i dlaczego.
 */


/* ============================================================================
 * 4. STRUKTURA FOLDERÓW
 * ==========================================================================*/

/* --- A) BY TYPE — dobre dla małych projektów -------------------------------
 * src/
 *   components/
 *   hooks/
 *   utils/
 *   types/
 *   api/
 *
 * PLUS:  proste, wszyscy rozumieją od razu
 * MINUS: przy 50+ komponentach nie wiadomo, co z czym się łączy.
 *        Jedna zmiana funkcjonalna = skakanie po 5 folderach.
 */

/* --- B) BY FEATURE — skaluje się -------------------------------------------
 * src/
 *   features/
 *     auth/
 *       components/    LoginForm.tsx
 *       hooks/         useAuth.ts
 *       api/           authApi.ts
 *       types.ts
 *       index.ts       ← publiczne API modułu
 *     cart/
 *       components/    Cart.tsx, CartItem.tsx
 *       cartReducer.ts
 *       index.ts
 *   shared/            ← używane przez WIELE features
 *     components/ui/   Button.tsx, Modal.tsx
 *     hooks/           useDebounce.ts, useLocalStorage.ts
 *     lib/             fetchClient.ts
 *   app/               ← routing (Next.js)
 *
 * PLUS:  wszystko o jednej funkcji w jednym miejscu, łatwo usunąć całą feature,
 *        naturalne granice dla zespołu, łatwiej o code ownership
 * MINUS: trzeba decydować "czy to shared, czy feature-specific"
 *
 * REGUŁA: zaczyna być shared dopiero, gdy używa tego DRUGA feature.
 *         Nie przenoś "na zapas".
 */

/* --- CO ODPOWIEDZIEĆ NA ROZMOWIE -------------------------------------------
 * "Przy małej apce by-type wystarcza. Powyżej kilkunastu ekranów przechodzę
 *  na by-feature, bo wtedy zmiana jednej funkcji nie oznacza skakania po
 *  wszystkich folderach. Shared trzymam osobno, ale przenoszę tam dopiero,
 *  gdy coś jest faktycznie używane w kilku miejscach."
 *
 * To pokazuje, że masz zdanie ORAZ że nie przeinżynierowujesz.
 */

// BARREL EXPORTS (index.ts re-eksportujący zawartość folderu):
//   PLUS:  ładne importy, jawne publiczne API modułu
//   MINUS: potrafi psuć tree-shaking i spowalniać build w dużych projektach,
//          ryzyko cyklicznych importów
//   Werdykt: OK jako publiczne API feature'a, unikaj barreli dla wszystkiego.


/* ============================================================================
 * 5. WARSTWY — co gdzie należy
 * ==========================================================================*/

//   ┌──────────────────────────────────────────────┐
//   │ KOMPONENTY        JSX, zdarzenia, kompozycja │  ← "co widać"
//   ├──────────────────────────────────────────────┤
//   │ HOOKI             stan, efekty, orkiestracja │  ← "jak się zachowuje"
//   ├──────────────────────────────────────────────┤
//   │ LOGIKA (pure)     walidacje, reducery,       │  ← "reguły"
//   │                   transformacje, selektory   │
//   ├──────────────────────────────────────────────┤
//   │ API               fetch, mapowanie DTO       │  ← "świat zewnętrzny"
//   └──────────────────────────────────────────────┘
//
// KIERUNEK ZALEŻNOŚCI: tylko w dół. Logika nie wie o komponentach.
//
// TEST NA DOBRY PODZIAŁ: czy da się to przetestować bez renderowania?
//   - reducer, walidacja, selektor  -> unit test, zero Reacta
//   - hook                          -> renderHook
//   - komponent                     -> RTL
// Jeśli nie da się przetestować logiki bez klikania w UI — jest w złym miejscu.
//
// WARSTWA API OSOBNO — nie tylko dla porządku:
//   - da się zamockować w testach (vi.mock("./api"))
//   - zmiana backendu dotyka jednego pliku
//   - mapowanie DTO -> model domenowy w jednym miejscu


/* ============================================================================
 * 6. KIEDY WYDZIELAĆ
 * ==========================================================================*/

/* --- KOMPONENT -------------------------------------------------------------
 * TAK, gdy:
 *   - powtarza się (2+ użycia)
 *   - ma własny, niezależny stan
 *   - plik przekracza ~200 linii i da się wyciąć spójny kawałek
 *   - da się nazwać jednym rzeczownikiem ("CartItem", "SearchInput")
 *
 * NIE, gdy:
 *   - tylko po to, żeby "plik był krótszy" (rozbicie bez granicy = gorzej)
 *   - musiałbyś przekazać 8 propsów, żeby to działało
 *
 * SYGNAŁ ZŁEGO PODZIAŁU: komponent przyjmuje mnóstwo propsów i przekazuje
 * je dalej bez używania. To znaczy, że granica jest w złym miejscu —
 * rozważ composition (children / sloty) zamiast propsów.
 */

/* --- CUSTOM HOOK -----------------------------------------------------------
 * TAK, gdy:
 *   - logika ze stanem/efektami powtarza się w kilku komponentach
 *   - jest nietrywialna (timing, cleanup, subskrypcja, fetch)
 *   - komponent robi za dużo i da się wyciąć spójne zachowanie
 *
 * NIE, gdy:
 *   - to jeden useState (useToggle bywa OK, ale nie zawsze warto)
 *   - "wygląda ładniej", ale nie ma reużycia ani złożoności
 *
 * PRZYKŁADY WARTE HOOKA: useDebounce, useFetch, useLocalStorage,
 *   useClickOutside, useMediaQuery, useIntersectionObserver
 */

/* --- CZYSTA FUNKCJA (do osobnego pliku) ------------------------------------
 * TAK, gdy: ma gałęzie, transformuje dane, ma edge case'y warte testów
 * NIE, gdy: to jednolinijkowy ternary (over-engineering)
 */


/* ============================================================================
 * 7. TYPOWE PYTANIA NA ROZMOWIE + SZKIELETY ODPOWIEDZI
 * ==========================================================================*/

// PYT: "Jak byś zorganizował średniej wielkości aplikację?"
// ODP: "Zapytałbym najpierw o skalę i zespół. Domyślnie: by-feature dla
//       modułów domenowych, osobny shared na to, co faktycznie współdzielone.
//       Warstwowo: komponenty / hooki / czysta logika / api. Server state
//       przez React Query, client state lokalnie, globalnie tylko to, co
//       naprawdę globalne. Kryterium podziału to testowalność — jeśli logiki
//       nie da się przetestować bez renderowania, jest w złym miejscu."

// PYT: "Context czy Zustand?"
// ODP: "Context do rzeczy rzadko zmieniających się i naprawdę globalnych —
//       theme, locale, user. Zustand, gdy stan zmienia się często i ma wielu
//       konsumentów, bo Context re-renderuje WSZYSTKICH konsumentów przy
//       każdej zmianie, a Zustand ma selektory. Do danych z serwera ani
//       jedno, ani drugie — React Query."

// PYT: "Kiedy Redux?"
// ODP: "Do nowego projektu raczej nie — server state idzie do React Query,
//       a client state do Zustanda, co pokrywa większość przypadków.
//       Redux ma sens przy dużym zespole, gdy zależy nam na sztywnej
//       konwencji i DevTools, albo gdy już jest w projekcie. Wtedy RTK,
//       nie stary Redux."

// PYT: "Gdzie trzymasz stan formularza?"
// ODP: "Małe formularze — useState, ewentualnie useReducer, gdy pól jest
//       dużo i przejścia stanu są powiązane. Duże i dynamiczne — React Hook
//       Form, bo uncontrolled inputy oznaczają mniej re-renderów, plus
//       walidacja przez Zod. Walidację trzymam jako czystą funkcję poza
//       komponentem, żeby dało się ją testować unitami."

// PYT: "Jak dzielisz komponenty?"
// ODP: "Po odpowiedzialności, nie po długości pliku. Wydzielam, gdy coś się
//       powtarza, ma własny stan albo da się nazwać jednym rzeczownikiem.
//       Jeśli wydzielenie wymaga przekazania ośmiu propsów, to znak, że
//       granica jest w złym miejscu — wtedy raczej composition."

// PYT: "Jak podchodzisz do optymalizacji?"
// ODP: "Domyślnie nie optymalizuję. Najpierw mierzę Profilerem, gdzie
//       faktycznie boli. memo bez useCallback na propsach-funkcjach nic nie
//       daje, więc dokładanie ich 'na wszelki wypadek' to koszt bez zysku.
//       Zwykle większy efekt daje zmiana struktury — mniej stanu, stan bliżej
//       miejsca użycia, derived zamiast zduplikowanego."

// PYT: "Testy — jak?"
// ODP: "Czystą logikę unitami, bo to najtańsze i najprecyzyjniejsze.
//       Hooki przez renderHook, gdy mają timing albo efekty. Komponenty
//       przez RTL — testuję zachowanie, nie implementację. Nie duplikuję:
//       jeśli reguła jest pokryta unitem, w RTL sprawdzam tylko, czy
//       komponent poprawnie jej używa."


/* ============================================================================
 * 8. WZORCE — KOD REFERENCYJNY
 * ==========================================================================*/

/* --- Context + guarded hook (theme / auth / cokolwiek globalnego) ---------- */

// type ThemeContextValue = { theme: Theme; toggleTheme: () => void }
//
// // undefined jako default — pozwala wykryć użycie poza providerem.
// // Fałszywy default ({ theme: "light", toggleTheme: () => {} }) po cichu
// // "działa" i ukrywa bug.
// const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)
//
// export function ThemeProvider({ children }: { children: ReactNode }) {
//   const [theme, setTheme] = useLocalStorage<Theme>("theme", "light")
//   const toggleTheme = useCallback(
//     () => setTheme(p => (p === "light" ? "dark" : "light")),
//     [setTheme]
//   )
//   // useMemo, żeby konsumenci nie renderowali się przy każdym renderze providera
//   const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])
//   return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
// }
//
// export function useTheme(): ThemeContextValue {
//   const ctx = useContext(ThemeContext)
//   if (ctx === undefined) throw new Error("useTheme must be used within ThemeProvider")
//   return ctx   // TS zawęża po throw -> konsument nie musi sprawdzać undefined
// }

/* --- Rozdzielenie kontekstu na stan i akcje (gdy zmienia się często) ------- */
// StateContext  — zmienia się, konsumenci renderują
// ActionsContext — stabilny (useMemo z pustymi deps), konsumenci NIE renderują
// Komponent, który tylko dispatchuje, subskrybuje sam ActionsContext.

/* --- Warstwa API ----------------------------------------------------------- */
// // shared/lib/apiClient.ts — jedno miejsce na baseUrl, nagłówki, obsługę błędów
// export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
//   const res = await fetch(`${BASE_URL}${path}`, {
//     ...init,
//     headers: { "Content-Type": "application/json", ...init?.headers },
//   })
//   if (!res.ok) throw new ApiError(res.status, await res.text())
//   return res.json() as Promise<T>
// }
//
// // features/users/api.ts — funkcje domenowe, nie gołe fetche w komponentach
// export const getUsers = (page: number) => apiFetch<UsersResponse>(`/users?page=${page}`)


/* ============================================================================
 * 9. ANTYWZORCE ARCHITEKTONICZNE
 * ==========================================================================*/

// [!] Server state w globalnym store — piszesz własny cache i invalidację.
//     -> React Query.

// [!] Wszystko w jednym Contextcie — każda zmiana renderuje całą apkę.
//     -> rozdziel konteksty albo użyj store'a z selektorami.

// [!] Globalny store "na zapas" — stan, którego używa jeden komponent.
//     -> useState. Stan najbliżej miejsca użycia.

// [!] Prop drilling przez 5 poziomów.
//     -> Context ALBO composition (children / sloty). Composition często lepsze:
//        <Layout header={<Header user={user}/>}/> zamiast przekazywania user w dół.

// [!] Derived state w useState + useEffect.
//     -> licz w renderze.

// [!] Filtry / paginacja / search w useState zamiast w URL.
//     -> searchParams. Inaczej nie da się wysłać linku ani odświeżyć strony.

// [!] Gołe fetche rozsypane po komponentach.
//     -> warstwa api + hook. Inaczej nie da się zamockować w testach ani
//        zmienić backendu bez przeszukiwania całego repo.

// [!] Komponent 600 linii robiący fetch, walidację, transformację i render.
//     -> wyciągnij logikę; kryterium: czy da się to przetestować bez renderu.

// [!] Przedwczesna abstrakcja — generyczny <DataTable> z 30 propsami po
//     drugim użyciu. Reguła: abstrahuj przy TRZECIM powtórzeniu, nie drugim.

// [!] Struktura folderów skopiowana z tutoriala bez zrozumienia
//     (atomic design w apce z 8 ekranami).


/* ============================================================================
 * 10. TL;DR — ŚCIĄGA DECYZYJNA
 * ==========================================================================*/

// dane z API?                      -> React Query
// filtry / paginacja / search?      -> URL (searchParams)
// da się policzyć z innego stanu?   -> licz w renderze (nie trzymaj)
// używa tego jeden komponent?       -> useState
// dwa-trzy komponenty?              -> lifting state up
// globalne, rzadko się zmienia?     -> Context
// globalne, często się zmienia?     -> Zustand
// duży zespół + sztywna konwencja?  -> Redux Toolkit
// formularz mały?                   -> useState / useReducer
// formularz duży/dynamiczny?        -> React Hook Form + Zod
//
// STRUKTURA:  mała apka -> by type. Większa -> by feature + shared.
// WARSTWY:    komponenty / hooki / czysta logika / api. Zależności w dół.
// KRYTERIUM:  jeśli logiki nie da się przetestować bez renderowania —
//             jest w złym miejscu.
//
// I NAJWAŻNIEJSZE NA ROZMOWIE:
//   zacznij od najprostszego, powiedz co by Cię przekonało do zmiany,
//   nazwij koszt każdego wyboru.

export {}