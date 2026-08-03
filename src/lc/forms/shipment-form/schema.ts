import {z} from 'zod'


export function weightSummary(packages: { weight: unknown }[]): number {

    return packages.reduce((sum, packg) => {
        const value = Number(packg.weight)
        const isNotNumber = Number.isNaN(value)

        if (isNotNumber) return sum
        return sum + value

    }, 0)


}

const PRICES = {standard: 15, express: 30, cod: 20}
const EXTRA_WEIGHT = 10
const COST_PER_EXTRA_KG = 5
const INSURANCE_COST = 10


export function summaryCost(packages: {
    weight: unknown
}[], deliveryType: ShipmentFormValues['deliveryType'], insured: boolean) {
    const weight = weightSummary(packages)
    const deliveryCost = PRICES[deliveryType]

    const overWeight = weight > EXTRA_WEIGHT ? Math.ceil(weight - EXTRA_WEIGHT) : 0

    const weightCostSummary = overWeight * COST_PER_EXTRA_KG

    const insuredCostSummary = insured ? INSURANCE_COST : 0


    return deliveryCost + weightCostSummary + insuredCostSummary

}


const packageSchema = z.object({
    description: z.string().min(2, {error: "podaj opis cwelu"}),
    weight: z.coerce.number().positive({error: 'liczba musi byc dodatnia'})
})

export const shipmentSchema = z.object({
    senderName: z
        .string()
        .min(3, {error: 'sender name zbyt krótkie'})
        .max(60, {error: 'sender name zbyt dlugie'}),
    email: z
        .string()
        .min(1, {error: "Email jest wymagany"})
        .email({error: "Nieprawidłowy format email"}),
    deliveryType: z.enum(["standard", "express", "cod"]),
    codAmount: z.string().optional(),
    packages: z.array(packageSchema).min(1, {error: 'dodaj minimum 1 paczke'}),
    insured: z.boolean(),
    declaredValue: z.string().optional(),


}).superRefine((data, ctx) => {
    if (data.deliveryType === "cod") {
        // codAmount niepuste i po konwersji > 0
        const raw = data.codAmount?.trim() ?? ""

        if (!raw) {
            ctx.addIssue({code: 'custom', message: 'kwota wymagana', path: ["codAmount"]})
        } else if (Number.isNaN(Number(raw))) {
            ctx.addIssue({code: 'custom', message: 'kwota musi byc liczba', path: ["codAmount"]})

        } else if (Number(raw) <= 0) {
            ctx.addIssue({code: 'custom', message: 'kwota wieksza od 0', path: ["codAmount"]})

        }

        // ctx.addIssue({})

    }

    if (data.insured) {

        const raw = data.declaredValue?.trim() ?? ""

        if (!raw) {
            ctx.addIssue({code: 'custom', message: ' pole wymagane', path: ["declaredValue"]})

        } else if (Number.isNaN(Number(raw))) {
            ctx.addIssue({code: 'custom', message: 'pole musibyc liczba', path: ["declaredValue"]})

        } else if (Number(raw) <= 0) {
            ctx.addIssue({code: 'custom', message: ' liczba musi byc wieksza od 0', path: ["declaredValue"]})

        }
    }
    if (weightSummary(data.packages) > 30) {
        ctx.addIssue({code: 'custom', message: 'zbyt ciezka paczka', path: ["packages"]})

    }
    // suma wag wszystkich paczek ≤ 30 kg
})


export type ShipmentFormValues = z.input<typeof shipmentSchema>
export type ShipmentFormOutput = z.output<typeof shipmentSchema>


