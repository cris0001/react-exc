'use client'

import {useState} from "react"
import {useForm, useFieldArray, useWatch} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {
    orderSchema,
    calculateTotal,
    applyDiscount,
    type OrderFormValues,
    type OrderFormOutput,
} from "./schema"
import {submitOrder} from "./api"

export function OrderForm() {
    const [submitError, setSubmitError] = useState("")
    const [isSuccess, setIsSuccess] = useState(false)

    const {
        register,
        control,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = useForm<OrderFormValues>({
        resolver: zodResolver(orderSchema),
        defaultValues: {
            email: "",
            items: [{description: "", quantity: 1, unitPrice: 0}],
            paymentMethod: "transfer",
            cardNumber: "",
            discountCode: "",
        },
        mode: "onTouched",
    })

    const {fields, append, remove} = useFieldArray({
        control,
        name: "items",
    })

    const watchedItems = useWatch({control, name: "items"}) ?? []
    const watchedDiscount = useWatch({control, name: "discountCode"})
    const paymentMethod = useWatch({control, name: "paymentMethod"})

    const total = calculateTotal(watchedItems)
    const totalAfterDiscount = applyDiscount(total, watchedDiscount)

    const onSubmit = async (data: OrderFormValues) => {
        setSubmitError("")
        try {
            await submitOrder(data as unknown as OrderFormOutput)
            setIsSuccess(true)
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : "Coś poszło nie tak")
        }
    }

    if (isSuccess) return <p className="p-4">Zamówienie przyjęte.</p>

    // text-base (16px) na WSZYSTKICH inputach — iOS Safari automatycznie
    // przybliża stronę przy focusie na polu z czcionką mniejszą niż 16px.
    // To najczęstszy "bug" mobilny w formularzach.
    const inputClass = "w-full border border-gray-300 p-2 rounded text-base"

    return (
        <>

            <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                // px-4 na mobile, żeby treść nie kleiła się do krawędzi ekranu
                className="flex flex-col gap-6 w-full max-w-2xl px-4 sm:px-0"
            >
                {/* EMAIL */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        // inputMode + autoComplete — na mobile klawiatura od razu
                        // pokazuje @ i .com, a przeglądarka podpowiada zapisany adres
                        inputMode="email"
                        autoComplete="email"
                        {...register("email")}
                        aria-invalid={!!errors.email}
                        className={inputClass}
                    />
                    {errors.email && (
                        <span role="alert" className="text-sm text-red-600">
                        {errors.email.message}
                    </span>
                    )}
                </div>

                {/* POZYCJE — dynamiczne pola */}
                <fieldset className="border border-gray-200 p-3 sm:p-4 rounded">
                    <legend className="px-2">Pozycje</legend>

                    <div className="flex flex-col gap-4">
                        {fields.map((field, index) => (
                            <div
                                key={field.id}
                                // NA MOBILE każda pozycja to osobna "karta" z ramką —
                                // bez tego trzy pola pod sobą zlewają się w jedną masę
                                // i nie widać, gdzie kończy się jedna pozycja.
                                // Od sm: ramka znika, bo układ poziomy sam grupuje wizualnie.
                                className="flex flex-col sm:flex-row gap-2 sm:items-start border border-gray-100 sm:border-0 rounded p-3 sm:p-0"
                            >
                                {/* Numer pozycji — tylko na mobile, gdzie brak układu
                                w kolumnach i łatwo się pogubić */}
                                <p className="text-sm text-gray-500 sm:hidden">
                                    Pozycja {index + 1}
                                </p>

                                <div className="flex flex-col gap-1 w-full sm:flex-1">
                                    <label htmlFor={`items.${index}.description`} className="text-sm">
                                        Opis
                                    </label>
                                    <input
                                        id={`items.${index}.description`}
                                        {...register(`items.${index}.description`)}
                                        aria-invalid={!!errors.items?.[index]?.description}
                                        className={inputClass}
                                    />
                                    {errors.items?.[index]?.description && (
                                        <span role="alert" className="text-sm text-red-600">
                                        {errors.items[index]?.description?.message}
                                    </span>
                                    )}
                                </div>

                                {/* Ilość i cena obok siebie NAWET na mobile —
                                to krótkie pola, więc dwie kolumny się mieszczą
                                i formularz nie robi się absurdalnie długi */}
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <div className="flex flex-col gap-1 flex-1 sm:flex-none sm:w-24">
                                        <label htmlFor={`items.${index}.quantity`} className="text-sm">
                                            Ilość
                                        </label>
                                        <input
                                            id={`items.${index}.quantity`}
                                            type="number"
                                            // inputMode="numeric" -> klawiatura numeryczna na mobile
                                            inputMode="numeric"
                                            {...register(`items.${index}.quantity`)}
                                            aria-invalid={!!errors.items?.[index]?.quantity}
                                            className={inputClass}
                                        />
                                        {errors.items?.[index]?.quantity && (
                                            <span role="alert" className="text-sm text-red-600">
                                            {errors.items[index]?.quantity?.message}
                                        </span>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-1 flex-1 sm:flex-none sm:w-28">
                                        <label htmlFor={`items.${index}.unitPrice`} className="text-sm">
                                            Cena
                                        </label>
                                        <input
                                            id={`items.${index}.unitPrice`}
                                            type="number"
                                            step="0.01"
                                            // decimal, a nie numeric — klawiatura z przecinkiem
                                            inputMode="decimal"
                                            {...register(`items.${index}.unitPrice`)}
                                            aria-invalid={!!errors.items?.[index]?.unitPrice}
                                            className={inputClass}
                                        />
                                        {errors.items?.[index]?.unitPrice && (
                                            <span role="alert" className="text-sm text-red-600">
                                            {errors.items[index]?.unitPrice?.message}
                                        </span>
                                        )}
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    disabled={fields.length === 1}
                                    aria-label={`Usuń pozycję ${index + 1}`}
                                    // min-h-11 (44px) — minimalny rozmiar celu dotykowego
                                    // zalecany przez WCAG. Mniejsze przyciski są trudne
                                    // do trafienia palcem.
                                    // Na mobile pełna szerokość, od sm: wyrównany do inputów (mt-6).
                                    className="w-full sm:w-auto min-h-11 sm:mt-6 border border-gray-400 px-3 py-2 rounded disabled:text-gray-300 disabled:border-gray-200"
                                >
                                    Usuń
                                </button>
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={() => append({description: "", quantity: 1, unitPrice: 0})}
                        className="mt-4 w-full sm:w-auto min-h-11 border border-gray-400 px-3 py-2 rounded"
                    >
                        Dodaj pozycję
                    </button>
                </fieldset>

                {/* PŁATNOŚĆ */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="paymentMethod">Metoda płatności</label>
                    <select
                        id="paymentMethod"
                        {...register("paymentMethod")}
                        className={inputClass}
                    >
                        <option value="transfer">Przelew</option>
                        <option value="card">Karta</option>
                    </select>
                </div>

                {/* NUMER KARTY — pole warunkowe */}
                {paymentMethod === "card" && (
                    <div className="flex flex-col gap-1">
                        <label htmlFor="cardNumber">Numer karty</label>
                        <input
                            id="cardNumber"
                            inputMode="numeric"
                            autoComplete="cc-number"
                            {...register("cardNumber")}
                            aria-invalid={!!errors.cardNumber}
                            className={inputClass}
                        />
                        {errors.cardNumber && (
                            <span role="alert" className="text-sm text-red-600">
                            {errors.cardNumber.message}
                        </span>
                        )}
                    </div>
                )}

                {/* KOD RABATOWY */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="discountCode">Kod rabatowy</label>
                    <input
                        id="discountCode"
                        autoCapitalize="characters"   // kody rabatowe to zwykle wielkie litery
                        {...register("discountCode")}
                        aria-invalid={!!errors.discountCode}
                        className={inputClass}
                    />
                    {errors.discountCode && (
                        <span role="alert" className="text-sm text-red-600">
                        {errors.discountCode.message}
                    </span>
                    )}
                </div>

                {/* SUMA */}
                <div className="border-t pt-4">
                    <p className="flex justify-between sm:justify-start sm:gap-2">
                        <span>Suma:</span>
                        <span>{total.toFixed(2)} zł</span>
                    </p>
                    {totalAfterDiscount !== total && (
                        <p className="flex justify-between sm:justify-start sm:gap-2 font-bold">
                            <span>Po rabacie:</span>
                            <span>{totalAfterDiscount.toFixed(2)} zł</span>
                        </p>
                    )}
                </div>

                {submitError && (
                    <span role="alert" className="text-sm text-red-600">{submitError}</span>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    // pełna szerokość na mobile — kciukiem łatwiej trafić
                    className="w-full sm:w-auto sm:self-start min-h-11 bg-gray-300 text-white px-6 py-2 rounded disabled:bg-gray-400"
                >
                    {isSubmitting ? "Wysyłanie..." : "Złóż zamówienie"}
                </button>
            </form>
        </>
    )
}

