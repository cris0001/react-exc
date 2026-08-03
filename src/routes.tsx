import { Suspense,lazy } from "react"
import type { RouteObject } from "react-router-dom"

const modules = import.meta.glob("./{lc,react}/**/page.tsx")

export type TaskRoute = {
    path: string
    section: string
    name: string
}

function pathFromKey(key: string): string {
    return key.replace(/^\./, "").replace(/\/page\.tsx$/, "")
}

export const taskRoutes: TaskRoute[] = Object.keys(modules)
    .map((key) => {
        const path = pathFromKey(key)
        const parts = path.split("/").filter(Boolean)
        return {
            path,
            section: parts[0] ?? "",
            name: parts.slice(1).join(" / ") || path,
        }
    })
    .sort((a, b) => a.path.localeCompare(b.path))

export const routes: RouteObject[] = Object.entries(modules).map(([key, loader]) => {
    const path = pathFromKey(key)
    const Lazy = lazy(async () => {
        const mod = (await loader()) as { default?: React.ComponentType }
        if (mod.default) return { default: mod.default }
        return {
            default: () => (
                <div style={{ padding: 24 }}>
                    <p>Ten page.tsx nie ma export default — plik roboczy bez komponentu.</p>
                    <code>{path}</code>
                </div>
            ),
        }
    })
    return {
        path,
        element: (
            <Suspense fallback={<div style={{ padding: 24 }}>Ładowanie…</div>}>
                <Lazy />
            </Suspense>
        ),
    }
})