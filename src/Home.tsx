import { Link } from "react-router-dom"
import { taskRoutes } from "./routes"

export default function Home() {
  // Grupuj po sekcji (lc/react), a w lc dodatkowo po temacie (forms/data/ui/bugs).
  const grouped = taskRoutes.reduce<Record<string, typeof taskRoutes>>((acc, r) => {
    const parts = r.path.split("/").filter(Boolean)
    const group = parts.length >= 3 ? `${parts[0]} / ${parts[1]}` : parts[0]
    ;(acc[group] ??= []).push(r)
    return acc
  }, {})

  const groups = Object.keys(grouped).sort()

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1>Ćwiczenia</h1>
      <p style={{ color: "#666" }}>
        Zadania z routingiem. Pliki czysto logiczne (JS, TS, hooki, reducery bez UI) są
        w projekcie, ale nie mają tras — otwórz je w edytorze.
      </p>

      {groups.map((group) => (
        <section key={group} style={{ marginTop: 28 }}>
          <h2 style={{ fontSize: 18, borderBottom: "1px solid #eee", paddingBottom: 4 }}>
            {group}
          </h2>
          <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 6 }}>
            {grouped[group].map((r) => (
              <li key={r.path}>
                <Link to={r.path} style={{ textDecoration: "none", color: "#0645ad" }}>
                  {r.path.split("/").slice(2).join(" / ") || r.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
