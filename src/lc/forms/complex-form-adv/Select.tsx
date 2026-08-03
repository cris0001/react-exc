'use client'

// ============================================================================
// UDAWANY KOMPONENT Z BIBLIOTEKI UI.
//
// Kluczowa cecha: przyjmuje `value` i `onChange` jako PROPSY, a nie
// rozkłada się na zwykły <input>. Dokładnie tak działają komponenty
// z MUI, Ant Design, react-select, date pickery itd.
//
// Dlatego register() na nim NIE zadziała — register zwraca
// { name, onChange, onBlur, ref }, a ten komponent nie ma gdzie podpiąć
// refa do elementu formularza. Stąd Controller.
// ============================================================================

type Option = { value: string; label: string }

type SelectProps = {
    id?: string
    label: string
    options: Option[]
    value: string
    onChange: (value: string) => void   // ← własny kształt, nie zdarzenie DOM
    onBlur?: () => void
    error?: boolean
}

export function Select({id, label, options, value, onChange, onBlur, error}: SelectProps) {
    return (
        <div className="flex flex-col gap-1">
            <label htmlFor={id}>{label}</label>
            <select
                id={id}
                value={value}
                // komponent sam decyduje, CO przekazuje w onChange —
                // tu goły string, nie obiekt zdarzenia
                onChange={(e) => onChange(e.target.value)}
                onBlur={onBlur}
                aria-invalid={error}
                className="w-full border border-gray-300 p-2 rounded text-base"
            >
                <option value="">— wybierz —</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    )
}
