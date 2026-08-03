# Ćwiczenia — React / JS / TS / Livecoding

Projekt zebrany z zadań porozrzucanych po starym projekcie Next.js i przeniesiony
na czysty **React + Vite + Vitest**. Kod zadań został przeniesiony bez zmian w
logice — poprawione są tylko ścieżki importów (aliasy Next `@/app/...` → lokalne).

## Uruchomienie

```bash
npm install
npm run dev        # serwer dev — strona główna listuje wszystkie zadania z UI
npm run test       # vitest w trybie watch
npm run test:run   # jednorazowy przebieg testów
npm run build      # build produkcyjny
```

Strona główna (`/`) automatycznie wykrywa każde zadanie mające `page.tsx` i buduje
do niego link. Dodanie nowego zadania = nowy folder z `page.tsx`, nic więcej.

## Struktura

```
src/
├── js/          Czysty JavaScript / TS-bez-Reacta
│                closures, currying, rekurencja, event loop, this/bind/call,
│                design patterns, ściągi. + workers/ (dedicated/shared/service)
│
├── ts/          Zadania typowania TypeScript
│                generics, infer, mapped/conditional types, utility types,
│                type guards, discriminated unions, keyof/typeof
│
├── react/       Krótkie zadania React (hooki, wzorce)
│   ├── hooks/       useDebounce, useThrottle, useFetch, usePrevious, useToggle…
│   ├── patterns/    compound, forwardRef, portal, render-props, HOC, compositions
│   ├── misc/        hooki-cw, hooki-per-cat (ćwiczenia mieszane)
│   ├── zad/         accordion, zad1
│   └── react-full-1/ modal, debug
│
├── lc/          Livecoding — realne, dłuższe zadania (pogrupowane tematycznie)
│   ├── forms/       login-basic, login-reducer, complex-form,
│   │                complex-form-adv, shipment-form
│   ├── data/        autocomplete-search, data-fetch-ui, infinite-scroll,
│   │                drag-drop, optimistic-{hook,reducer,state}
│   ├── ui/          cart, todo-list, star-rating, keyboard-a11y,
│   │                virtual-list, context
│   ├── bugs/        infinite-loop, stale-closure, performance, async-state
│   └── _hooks/      hooki współdzielone przez zadania lc (useDebounce, useLocalStorage)
│
├── examples/    Wygenerowane przykłady użycia (NIE zadania)
│   ├── zustand/
│   └── tanstack-query/
│
├── _notatki/    Ściągi tekstowe (architektura, code review)
│
├── shared/      Pliki współdzielone z aliasów @/types, @/store, @/lib, @/utils
│
└── _scratch/    Pliki zależne od starego realnego projektu (poza buildem)
                 — useAuth (next/navigation), ex2 (import z (authorized))
```

## Routing a pliki bez UI

Trasy powstają **tylko** dla plików `page.tsx` (coś renderują). Pliki czysto
logiczne — reducery, funkcje czyste, hooki, schematy Zod, całe `js/` i `ts/` —
są w projekcie i objęte testami, ale **nie mają tras**. Otwiera się je w edytorze.

Kilka `page.tsx` (np. `react/patterns/compositions/hooks`) nie ma `export default`
— to pliki robocze bez wyeksportowanego komponentu. Trasa pokaże wtedy komunikat
zamiast się wywalić.

## Testy

Testy jednostkowe (`.test.ts`) i komponentowe (`.test.tsx`, React Testing Library)
uruchamia Vitest w środowisku jsdom. Setup (`jest-dom` matchers) jest w
`src/test-setup.ts`.

**Uwaga:** część zadań była w trakcie robienia — mają celowe bugi albo
niedokończoną implementację, więc ich testy są czerwone. To stan zgodny z
oryginałem (kod nie był ruszany). Zielone: ~329/344. Czerwone skupione w
`keyboard-a11y/Combobox`, `complex-form/OrderForm`, `data-fetch-ui/useFetch`.

## Aliasy

`vite.config.ts` i `tsconfig.json` trzymają aliasy zgodne ze starym projektem,
żeby przeniesiony kod działał bez przepisywania:

- `@/types` → `src/shared/types`
- `@/store/*`, `@/lib/*`, `@/utils/*` → `src/shared/*`
- `@/*` → `src/*`
