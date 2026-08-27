import {useState} from "react";



type FormData = {
    name: string
    email: string
    street: string
    city: string
    zip: string      // ← kod pocztowy to STRING
}



type Step = {
    fields: (keyof FormData)[]
    validate: (data: FormData) => Partial<FormData>
}


const STEPS: Step[]=[
    {
        fields:['name','email'],
        validate: (data: FormData) => {
            const e: Partial<FormData> = {}
            if (data.name.trim().length < 3) e.name = 'Podaj imię'
            if (!data.email.includes('@')) e.email = 'Niepoprawny email'
            return e
        },
    },
    {
        fields: ['street', 'city', 'zip'],
        validate: (data: FormData) => {
            const e: Partial<FormData> = {}
            if (!data.street.trim()) e.street = 'Podaj ulicę'
            if (!data.city.trim()) e.city = 'Podaj miasto'
            if (data.zip.trim().length < 3) e.zip = 'Podaj kod'
            return e
        },
    },
    { fields: [], validate: () => ({}) }

]

const LABELS: Record<keyof FormData, string> = {
    name: 'Imię',
    email: 'Email',
    street: 'Ulica',
    city: 'Miasto',
    zip: 'Kod pocztowy',
}

const TOTAL_STEPS = STEPS.length

export function WizardForm(){

    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState<FormData>({name:'',email:'',street:'', city:'',zip:''})

    const [errors, setErrors] = useState<Partial<FormData>>({})

    const handleChange = (name: keyof FormData, value: string) => {
        setFormData((prev) => ({...prev, [name]: value}))
        setErrors((prev) => ({...prev, [name]: ''}))
    }




    const handleNext = ()=>{
        const e = STEPS[step-1].validate(formData)
        setErrors(e)
        console.log(e)
        if(Object.keys(e).length=== 0) setStep((s) => s + 1)
    }

    const submit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log(formData)
        setFormData({name:'', email:'', street:'', city:'', zip:''})
        setStep(1)
    }


    return(
        <>

            <form noValidate={true} onSubmit={submit} className={'flex flex-col px-4 py-4'}>

                <div className={'p-6'}>{step}/{TOTAL_STEPS}</div>

                {STEPS[step-1].fields.map((field) => (
                    <div key={field} className={'flex flex-col'}>
                        <label className={'text-[13px]'} htmlFor={field}>{LABELS[field]}</label>
                        <input
                            id={field}
                            className={'border rounded border-gray-200 px-2 py-1'}
                            value={formData[field]}
                            onChange={(e) => handleChange(field, e.target.value)}
                        />
                        {errors[field] && <span className={'text-xs text-red-300'}>{errors[field]}</span>}
                    </div>
                ))}

                {step === TOTAL_STEPS && <>
                    {Object.entries(formData).map(([key, value]) => (
                        <span key={key}>{LABELS[key as keyof FormData]}: <strong>{value}</strong></span>
                    ))}
                </>}

              <div className={'flex gap-2 justify-center mt-4'}>
                  {step>1 && <button type={'button'} onClick={() => setStep((s)=> s-1)}>prev</button>}
                  {(step < TOTAL_STEPS) && <button type={'button'} onClick={ handleNext}>Next</button>}
              </div>

                {step === TOTAL_STEPS && <button  type={'submit'} >submit</button>}
            </form>
        </>
    )
}