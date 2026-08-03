# Zustand — struktura i użycie

```
zustand/
├── store/
│   ├── cartStore.ts    # stan + akcje + selektory
│   └── authStore.ts    # middleware persist (localStorage)
├── components/         # konsumują store PRZEZ SELEKTORY
├── types/cart.ts
└── index.ts
```

**Zero providera** — store żyje poza Reactem, importujesz go bezpośrednio.

## Selektory — to jest cała gra

```tsx
// ✅ subskrybujesz tylko to, czego używasz -> re-render tylko przy zmianie tego
const totalItems = useCartStore(selectTotalItems)
const addItem = useCartStore((s) => s.addItem)   // akcje są STABILNE -> zero re-renderów

// ❌ cały stan -> re-render przy każdej zmianie czegokolwiek
const state = useCartStore()

// ⚠️ kilka pól naraz -> useShallow (inaczej nowy obiekt co render = pętla)
const { items, clear } = useCartStore(useShallow((s) => ({ items: s.items, clear: s.clear })))
```

## Zustand vs Context

| | Context | Zustand |
|---|---|---|
| selektory | **brak** — zmiana value = re-render WSZYSTKICH konsumentów | **są** — re-render tylko przy zmianie wybranego kawałka |
| provider | wymagany | **niepotrzebny** |
| dostęp spoza komponentu | nie | **tak** (`useCartStore.getState()`) |
| boilerplate | średni | minimalny |

## Jak to działa pod spodem

Zwykły obiekt JS poza Reactem + `Set` listenerów + **`useSyncExternalStore`**.
Dlatego:
- stan dostępny spoza drzewa Reacta (`getState()` z dowolnego pliku)
- brak tearingu (useSyncExternalStore gwarantuje spójny odczyt)
- **aktualizacje są zawsze pilne** -> `startTransition` na nich NIE działa

## Zasady

- **NIE trzymaj tu danych z serwera** — od tego jest TanStack Query
- Zustand = stan **klienta**: koszyk, theme, auth, UI (modal otwarty, sidebar)
- nie mutuj stanu — twórz nowe obiekty/tablice (`[...items]`, `{...item}`)
- selektory trzymaj obok store'a, nie w komponentach
