'use client'

import {useState} from "react"
import {useForm, Controller, useWatch} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {
    ticketSchema,
    defaultValues,
    CATEGORIES,
    type TicketFormValues,
} from "./schema"
import {createTicket, FieldError} from "./api"
import {Select} from "./Select"

export function TicketForm() {
    const [submitError, setSubmitError] = useState("")
    const [successId, setSuccessId] = useState<number | null>(null)

    const {
        register,
        control,
        handleSubmit,
        reset,
        setError,
        setFocus,
        formState: {errors, isSubmitting},
    } = useForm<TicketFormValues>({
        resolver: zodResolver(ticketSchema),
        defaultValues,
        mode: "onTouched",
    })

    const type = useWatch({control, name: "type"})

    const onSubmit = async (data: TicketFormValues) => {
        setSubmitError("")
        setSuccessId(null)

        try {
            const result = await createTicket(data)

            setSuccessId(result.id)

            // ---- reset() ----
            // Bez argumentu wraca do defaultValues z useForm.
            // Czyści też errors, isDirty i touchedFields — czyli formularz
            // wygląda jak świeżo zamontowany.
            //
            // reset(wartości) ustawia NOWE wartości domyślne — przydatne przy
            // edycji: po zapisie to, co jest w polach, staje się nowym "czystym"
            // stanem, więc isDirty znowu jest false.
            reset()

            // focus na pierwsze pole — user od razu może pisać kolejne zgłoszenie
            setFocus("title")
        } catch (err) {
            // ---- setError() ----
            // Błąd DOTYCZĄCY POLA ląduje przy tym polu, nie w banerze.
            // Dzięki temu user widzi komunikat tam, gdzie musi poprawić.
            if (err instanceof FieldError) {
                setError(
                    err.field as keyof TicketFormValues,
                    {type: "server", message: err.message},
                    {shouldFocus: true},   // ← kursor skacze na to pole
                )
                return
            }

            // błąd ogólny (sieć, 500) -> baner, bo nie da się go przypisać do pola
            setSubmitError(err instanceof Error ? err.message : "Coś poszło nie tak")
        }
    }

    const inputClass = "w-full border border-gray-300 p-2 rounded text-base"

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="flex flex-col gap-5 w-full max-w-lg"
        >
            {successId && (
                <p role="status" className="p-3 border border-green-300 bg-green-50 rounded">
                    Utworzono zgłoszenie #{successId}
                </p>
            )}

            {submitError && (
                <p role="alert" className="p-3 border border-red-300 bg-red-50 text-red-700 rounded">
                    {submitError}
                </p>
            )}

            {/* TYTUŁ — zwykły input, register wystarcza */}
            <div className="flex flex-col gap-1">
                <label htmlFor="title">Tytuł</label>
                <input
                    id="title"
                    {...register("title")}
                    aria-invalid={!!errors.title}
                    className={inputClass}
                />
                {errors.title && (
                    <span role="alert" className="text-sm text-red-600">
                        {errors.title.message}
                    </span>
                )}
            </div>

            {/* KATEGORIA — komponent z własnym API, potrzebny Controller */}
            <Controller
                control={control}
                name="category"
                render={({field, fieldState}) => (
                    // field zawiera: { value, onChange, onBlur, name, ref, disabled }
                    // Rozdzielamy je ręcznie na propsy komponentu, bo on ma
                    // własny kształt API — nie da się zrobić {...field},
                    // skoro Select oczekuje onChange: (value: string) => void,
                    // a nie zdarzenia DOM.
                    <>
                        <Select
                            id="category"
                            label="Kategoria"
                            options={[...CATEGORIES]}
                            value={field.value}
                            onChange={field.onChange}   // ← Select woła to ze stringiem
                            onBlur={field.onBlur}       // ← bez tego mode:"onTouched" nie zadziała
                            error={!!fieldState.error}
                        />
                        {fieldState.error && (
                            <span role="alert" className="text-sm text-red-600">
                                {fieldState.error.message}
                            </span>
                        )}
                    </>
                )}
            />

            {/* TYP — radio, dyskryminator */}
            <fieldset className="flex flex-col gap-2">
                <legend className="mb-1">Typ zgłoszenia</legend>

                <label className="flex items-center gap-2">
                    <input type="radio" value="bug" {...register("type")}/>
                    Błąd
                </label>

                <label className="flex items-center gap-2">
                    <input type="radio" value="feature" {...register("type")}/>
                    Nowa funkcja
                </label>
            </fieldset>

            {/* POLE ZALEŻNE OD TYPU.
                Oba pola są ZAREJESTROWANE zawsze (żeby typ formularza był płaski),
                ale renderowane warunkowo. Nadmiarowe pole zostanie odcięte
                przez Zoda przy walidacji unii. */}
            {type === "bug" ? (
                <div className="flex flex-col gap-1">
                    <label htmlFor="stepsToReproduce">Kroki do odtworzenia</label>
                    <textarea
                        id="stepsToReproduce"
                        rows={4}
                        {...register("stepsToReproduce")}
                        aria-invalid={!!errors.stepsToReproduce}
                        className={inputClass}
                    />
                    {errors.stepsToReproduce && (
                        <span role="alert" className="text-sm text-red-600">
                            {errors.stepsToReproduce.message}
                        </span>
                    )}
                </div>
            ) : (
                <div className="flex flex-col gap-1">
                    <label htmlFor="businessValue">Wartość biznesowa</label>
                    <textarea
                        id="businessValue"
                        rows={4}
                        {...register("businessValue")}
                        aria-invalid={!!errors.businessValue}
                        className={inputClass}
                    />
                    {errors.businessValue && (
                        <span role="alert" className="text-sm text-red-600">
                            {errors.businessValue.message}
                        </span>
                    )}
                </div>
            )}

            <div className="flex gap-2">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="min-h-11 bg-blue-600 text-white px-6 py-2 rounded disabled:bg-gray-400"
                >
                    {isSubmitting ? "Wysyłanie..." : "Utwórz"}
                </button>

                {/* reset dostępny też ręcznie */}
                <button
                    type="button"
                    onClick={() => {
                        reset()
                        setSubmitError("")
                        setSuccessId(null)
                    }}
                    className="min-h-11 border border-gray-400 px-4 py-2 rounded"
                >
                    Wyczyść
                </button>
            </div>
        </form>
    )
}

// ----------------------------------------------------------------------------
// 1. DLACZEGO register NIE DZIAŁA NA <Select/>
//
// register("category") zwraca { name, onChange, onBlur, ref }.
// Rozłożone na <input> podpina ref DO ELEMENTU DOM — i to jest cały mechanizm
// RHF: wartość żyje w DOM, hook czyta ją przez ref.
//
// Komponent z biblioteki UI nie jest elementem DOM. Ma własny stan i własne
// API (value: string, onChange: (v: string) => void). Nie ma czego objąć refem,
// a jego onChange dostaje string, nie zdarzenie.
//
// Controller robi most: bierze na siebie trzymanie wartości w stanie RHF
// i daje Ci obiekt `field`, który ręcznie rozdzielasz na propsy komponentu.
//
//   register   -> pole niekontrolowane, wartość w DOM   (zwykłe inputy)
//   Controller -> pole kontrolowane, wartość w RHF      (komponenty UI)
//
// KOSZT: Controller powoduje re-render przy każdej zmianie tego pola.
// Dlatego używasz go TYLKO tam, gdzie register nie wystarcza — nie wszędzie.
//
// UWAGA: field.onBlur trzeba przekazać ręcznie. Bez tego mode "onTouched"
// i "onBlur" nigdy nie odpalą walidacji dla tego pola — częsty, cichy bug.
//
//
// 2. reset()
//
//   reset()               -> wraca do defaultValues z useForm
//   reset(nowe)           -> ustawia NOWE domyślne (isDirty znowu false)
//   reset(nowe, {keepErrors: true, keepDirty: true, ...}) -> selektywnie
//
// Czyści nie tylko wartości, ale też errors, touchedFields, isDirty, isSubmitted.
// Przy edycji rekordu: po zapisie robisz reset(zapisaneWartości), żeby
// "czysty" stan przesunął się na to, co właśnie zapisano.
//
//
// 3. setError() vs useState
//
// Błąd z serwera dotyczący POLA ("email zajęty", "tytuł duplikat") to nie
// to samo co awaria ("500", "brak sieci").
//
//   setError("title", {...})  -> ląduje w errors.title, wyświetla się PRZY POLU,
//                                shouldFocus przenosi kursor, znika przy edycji pola
//   setState("...")           -> baner na górze, user musi sam znaleźć pole
//
// Reguła: błąd, który da się przypisać do pola -> setError.
//         błąd całej operacji -> osobny stan i baner.
//
// setError({type: "server"}) — "type" to tylko etykieta źródła błędu,
// przydatna gdy chcesz je odróżniać (np. inne stylowanie błędów serwera).
// ----------------------------------------------------------------------------
