'use client'

import {createContext, useContext, type ReactNode} from "react"
import {useLocalStorage} from "../../_hooks/useLocalStorage";

type Theme = "light" | "dark"

// The shape of what consumers get from the context.
type ThemeContextValue = {
    theme: Theme
    toggleTheme: () => void
}


export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export function ThemeProvider({children}: { children: ReactNode }) {
    // theme lives in localStorage so it survives reloads
    const [theme, setTheme] = useLocalStorage<Theme>("theme", "light")

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"))
    }

    return (
        <ThemeContext.Provider value={{theme, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}

// Custom hook — the ONLY way consumers touch the context.
// Hides `useContext(ThemeContext)` and enforces the provider check.
export function useTheme(): ThemeContextValue {
    const context = useContext(ThemeContext)

    if (context === undefined) {
        // Thrown when useTheme is called by a component that isn't
        // wrapped in <ThemeProvider>. Clear message instead of a
        // cryptic "cannot read theme of undefined" later.
        throw new Error("useTheme must be used within a ThemeProvider")
    }

    return context
}   