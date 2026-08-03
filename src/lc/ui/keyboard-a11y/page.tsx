'use client'

import {useState} from "react"
import {Combobox} from "./Combobox"
import {Modal} from "./Modal"

const FRUITS = [
    "Jabłko", "Banan", "Czereśnia", "Daktyl", "Figa",
    "Grejpfrut", "Kiwi", "Cytryna", "Mango", "Nektarynka",
]

export default function Page() {
    const [selected, setSelected] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)

    return (
        <main className="p-8 flex flex-col gap-10">
            <section>
                <h1 className="text-xl mb-4">Combobox z nawigacją klawiaturą</h1>
                <Combobox
                    label="Owoc"
                    options={FRUITS}
                    value={selected}
                    onChange={setSelected}
                />
                {selected && <p className="mt-4">Wybrano: {selected}</p>}
            </section>

            <section>
                <h1 className="text-xl mb-4">Modal z focus trap</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="border border-gray-400 px-4 py-2 rounded"
                >
                    Otwórz modal
                </button>
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="Potwierdzenie"
                >
                    <p className="mb-4">Czy na pewno chcesz kontynuować?</p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="border border-gray-400 px-3 py-1 rounded"
                        >
                            Anuluj
                        </button>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="bg-blue-600 text-white px-3 py-1 rounded"
                        >
                            Potwierdź
                        </button>
                    </div>
                </Modal>
            </section>
        </main>
    )
}


// ============================================================================
// TASK — KEYBOARD NAVIGATION & ACCESSIBILITY
// ============================================================================
//
// PART 1 — COMBOBOX (autocomplete with full keyboard support)
//   - typing filters the option list
//   - ArrowDown / ArrowUp move an "active" highlight through the options
//   - Enter selects the active option
//   - Escape closes the list (and on a second press, clears the input)
//   - Home / End jump to the first / last option
//   - the highlight wraps around (last -> first)
//   - the mouse and keyboard must not fight each other
//   - clicking outside closes the list
//
//   ARIA requirements (this is the part that separates seniors):
//     input:  role="combobox", aria-expanded, aria-controls,
//             aria-activedescendant, aria-autocomplete="list"
//     list:   role="listbox" with an id
//     option: role="option", aria-selected, and a STABLE id
//
//   KEY INSIGHT — aria-activedescendant:
//     Focus NEVER leaves the input. You do not move DOM focus onto options.
//     Instead the input points at the "virtually focused" option by id, and
//     the screen reader announces it. This is why arrow keys can navigate a
//     list while the user keeps typing.
//
// PART 2 — MODAL (focus trap)
//   - focus moves into the dialog when it opens
//   - Tab / Shift+Tab cycle ONLY inside the dialog (never escape to the page)
//   - Escape closes it
//   - focus returns to the element that opened it
//   - background is inert to screen readers (aria-hidden / aria-modal)
//   - background scroll is locked
//
// Think about:
//   - why aria-activedescendant instead of really focusing each option?
//   - what happens on Enter if nothing is highlighted?
//   - why must the option ids be stable and predictable?
//   - which element gets focus first in a dialog, and why not always the first button?
//   - how do you find the focusable elements inside a container?
//
// PRODUCTION NOTE:
//   Use Radix UI, React Aria or Headless UI for real comboboxes and dialogs.
//   The ARIA spec for a combobox is long and full of edge cases. Building it
//   by hand once teaches you what those libraries actually do for you.
// ============================================================================
