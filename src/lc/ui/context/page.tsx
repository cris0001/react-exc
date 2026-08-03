'use client'
import {ThemeProvider, useTheme} from "./ThemeContext"

// A button deep in the tree that toggles the theme.
// Note: it receives NO props about the theme — it reads context directly.
function ThemeToggleButton() {
    const {theme, toggleTheme} = useTheme()

    return (
        <button
            onClick={toggleTheme}
            className="border border-gray-400 px-3 py-1 rounded"
        >
            Switch to {theme === "light" ? "dark" : "light"}
        </button>
    )
}

// A separate component that only READS the theme — also no props.
function ThemedBox() {
    const {theme} = useTheme()

    return (
        <div
            className={
                theme === "light"
                    ? "bg-white text-black p-6 rounded"
                    : "bg-gray-900 text-white p-6 rounded"
            }
        >
            Current theme: <strong>{theme}</strong>
        </div>
    )
}

// A nested layer in between — it doesn't know or care about the theme,
// yet its children can still access it. That's the point of context:
// no prop drilling through intermediate components.
function Toolbar() {
    return (
        <div className="flex items-center gap-4 border-b pb-4">
            <span>Toolbar</span>
            <ThemeToggleButton/>
        </div>
    )
}

export default function Page() {

    return (
        <ThemeProvider>
            <div className="flex flex-col gap-4 p-8">
                <Toolbar/>
                <ThemedBox/>
            </div>
        </ThemeProvider>
    )
}


// A theme toggle with Context. Light/dark theme shared across components without prop drilling. Tests your understanding of Context + a custom consumer hook.
//
//
//
// Requirements:
//


//
//
//
// a ThemeProvider that holds the current theme ("light" | "dark") and a toggle function
// a useTheme custom hook to consume it
// the hook should throw a clear error if used outside the provider
// persist the theme to localStorage (reuse your useLocalStorage)
// a demo: a couple of components that read/toggle the theme via the hook (no prop drilling)
//
//
//ThemeContext.tsx    → context + provider + useTheme hook
//demo usage          → components consuming it
