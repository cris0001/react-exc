# TanStack Query — struktura i użycie

```
tanstack-query/
├── api/
│   ├── client.ts       # wrapper na fetch (baseUrl, nagłówki, throw na !res.ok)
│   ├── usersApi.ts     # SAME funkcje HTTP — zero Reacta (testowalne, reużywalne)
│   └── queryKeys.ts    # klucze cache w jednym miejscu (hierarchiczne)
├── hooks/
│   ├── useUsers.ts        # useQuery — lista
│   ├── useUser.ts         # useQuery z parametrem + enabled
│   ├── useCreateUser.ts   # useMutation + invalidateQueries
│   └── useDeleteUser.ts   # useMutation + optimistic update + rollback
├── components/         # UI — konsumuje TYLKO hooki, nie zna fetcha
├── types/user.ts
├── queryClient.ts      # jedna instancja + globalna konfiguracja
├── QueryProvider.tsx   # owija App (main.tsx)
└── index.ts            # barrel — publiczne API
```

## Warstwy (to jest sedno)

```
component  ->  hook (useQuery)  ->  api (fetch)
   UI            cache/klucze         czysty HTTP
```

Komponent **nigdy** nie woła `fetch` ani `usersApi` bezpośrednio.

## Kluczowe pojęcia

| | |
|---|---|
| **queryKey** | identyfikator w cache. Zmiana klucza = nowe zapytanie |
| **staleTime** | jak długo dane "świeże" (zero refetchu). Domyślnie 0 |
| **gcTime** | jak długo nieużywane dane siedzą w cache (dawniej cacheTime) |
| **isPending** | pierwsze ładowanie (nie ma danych) |
| **isFetching** | jakikolwiek fetch w tle (także refetch z danymi na ekranie) |
| **enabled** | warunkowe uruchomienie query |
| **invalidateQueries** | "te dane są nieaktualne" -> refetch |
| **optimistic update** | onMutate zmienia cache od razu, onError cofa |

## Query vs Mutation

- **useQuery** — odczyt (GET). Odpala się **sam**, cache'uje, dedupuje.
- **useMutation** — zmiana (POST/PUT/DELETE). Odpalasz **ręcznie** przez `mutate()`.

## Co to daje vs własny useFetch

- **cache** — te same dane z 5 komponentów = 1 request
- **deduplikacja** — równoległe wywołania scalone w jedno
- **refetch** — przy focusie okna, reconnect, invalidacji
- **retry** — automatyczne ponowienia
- **race condition** — załatwione (nie musisz AbortController)
- **devtools** — podgląd cache
