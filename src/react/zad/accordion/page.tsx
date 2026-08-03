'use client'

import {memo, useCallback, useState} from "react";

type Section = {
    id: number
    title: string
    content: string
}

const sections: Section[] = [
    {id: 1, title: "Czym jest React?", content: "Biblioteka JS do budowania UI opartego na komponentach."},
    {
        id: 2,
        title: "Co to hooki?",
        content: "Funkcje pozwalające używać stanu i cyklu życia w komponentach funkcyjnych."
    },
    {id: 3, title: "Czym jest JSX?", content: "Składnia pozwalająca pisać strukturę UI w JavaScript."},
    {
        id: 4,
        title: "Co to Virtual DOM?",
        content: "Lekka reprezentacja UI w pamięci, którą React porównuje z poprzednią wersją."
    },
]


export default function Page() {

    // null = nic nie otwarte (czytelniejsze niż -1)
    const [selectedId, setSelectedId] = useState<number | null>(null)

    // funkcyjny updater -> nie potrzebuje selectedId z domknięcia -> deps []
    // dzięki temu useCallback daje STABILNĄ referencję (ma sens przy memo w dziecku)
    const handleToggle = useCallback((id: number) => {
        setSelectedId((prev) => (prev === id ? null : id))
    }, [])

    return (
        <>
            <div className="flex flex-col gap-2">
                {sections.map((section) => (
                    <Accordion3Item
                        key={section.id}
                        section={section}
                        isOpen={selectedId === section.id}
                        onToggle={handleToggle}
                    />
                ))}
            </div>
        </>

    )
}


type AccordionItemProps = {
    section: Section
    isOpen: boolean
    onToggle: (id: number) => void
}

const AccordionItem = memo(function AccordionItem({section, isOpen, onToggle}: AccordionItemProps) {
    return (
        <div className="border border-gray-300 rounded">
            {/* button, nie span -> dostępny z klawiatury (Tab/Enter) */}
            <button
                onClick={() => onToggle(section.id)}
                className="flex w-full justify-between p-3 text-left"
            >
                {section.title}
                <strong>{isOpen ? '-' : '+'}</strong>
            </button>

            {isOpen && <div className="p-3 border-t border-gray-200">{section.content}</div>}
        </div>
    )
})

export function Accordion2Item({section, isOpen, onToggle}: AccordionItemProps) {
    return (
        <div className="border border-gray-300 rounded overflow-hidden">
            <button
                onClick={() => onToggle(section.id)}
                className="flex w-full justify-between p-3 text-left"
            >
                {section.title}
                <strong>{isOpen ? '-' : '+'}</strong>
            </button>

            <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{maxHeight: isOpen ? 500 : 0}}
            >
                <div className="p-3 border-t border-gray-200">
                    {section.content}
                </div>
            </div>
        </div>
    )
}

export function Accordion3Item({section, isOpen, onToggle}: AccordionItemProps) {
    return (
        <div className="border border-gray-300 rounded overflow-hidden">
            <button
                onClick={() => onToggle(section.id)}
                className="flex w-full justify-between p-3 text-left"
            >
                {section.title}
                <strong>{isOpen ? '-' : '+'}</strong>
            </button>

            <div
                className="grid transition-all duration-300 ease-in-out"
                style={{gridTemplateRows: isOpen ? '1fr' : '0fr'}}
            >
                <div className="overflow-hidden">
                    <div className="p-3 border-t border-gray-200">
                        {section.content}
                    </div>
                </div>
            </div>
        </div>
    )
}