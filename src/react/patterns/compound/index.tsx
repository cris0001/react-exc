import {createContext, useContext, useState, ReactNode} from "react"

// ============================================================
// COMPOUND COMPONENTS — Tabs
// Stan (aktywny tab) żyje w rodzicu, dzieci czytają go z CONTEXTU
// ============================================================

type TabsContextType = {
    activeTab: string
    setActiveTab: (id: string) => void
}

const TabsContext = createContext<TabsContextType | null>(null)

// hook pomocniczy — czyta context i pilnuje, żeby użyć wewnątrz <Tabs>
function useTabsContext() {
    const ctx = useContext(TabsContext)
    if (!ctx) throw new Error("Tabs.* musi być użyty wewnątrz <Tabs>")
    return ctx
}

// --- RODZIC: trzyma stan i dostarcza go przez context ---------
function Tabs({defaultTab, children}: { defaultTab: string; children: ReactNode }) {
    const [activeTab, setActiveTab] = useState(defaultTab)

    return (
        <TabsContext.Provider value={{activeTab, setActiveTab}}>
            <div>{children}</div>
        </TabsContext.Provider>
    )
}

// --- DZIECI: czytają stan z contextu, nie z propsów -----------

function TabList({children}: { children: ReactNode }) {
    return <div role="tablist">{children}</div>
}

function Tab({id, children}: { id: string; children: ReactNode }) {
    const {activeTab, setActiveTab} = useTabsContext()
    const isActive = activeTab === id

    return (
        <button
            role="tab"
            onClick={() => setActiveTab(id)}
            style={{fontWeight: isActive ? "bold" : "normal"}}
        >
            {children}
        </button>
    )
}

function TabPanel({id, children}: { id: string; children: ReactNode }) {
    const {activeTab} = useTabsContext()
    if (activeTab !== id) return null   // pokazuj tylko aktywny panel
    return <div role="tabpanel">{children}</div>
}

// --- SPINANIE: podpinasz dzieci jako właściwości rodzica ------
Tabs.List = TabList
Tabs.Tab = Tab
Tabs.Panel = TabPanel

// ============================================================
// UŻYCIE — konsument składa klocki, zero propsów między nimi
// ============================================================
function App() {
    return (
        <Tabs defaultTab="a">
            <Tabs.List>
                <Tabs.Tab id="a">Pierwsza</Tabs.Tab>
                <Tabs.Tab id="b">Druga</Tabs.Tab>
            </Tabs.List>

            {/* konsument ma swobodę — może wstawić cokolwiek między */}
            <hr/>

            <Tabs.Panel id="a">Treść pierwszej zakładki</Tabs.Panel>
            <Tabs.Panel id="b">Treść drugiej zakładki</Tabs.Panel>
        </Tabs>
    )
}