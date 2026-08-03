import { useState } from "react";

type FormData = {
    name: string;
    lastName: string;
    city: string;
    zip: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const INITIAL: FormData = { name: '', lastName: '', city: '', zip: '' };

export function StepForm() {
    const [formData, setFormData] = useState<FormData>(INITIAL);
    const [errors, setErrors] = useState<FormErrors>({});
    const [step, setStep] = useState<1 | 2 | 3>(1);



    const handleChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
        setErrors(prev => {
            if (!prev[field]) return prev;        
            const next = { ...prev };
            delete next[field];
            return next;
        });
    };

    const validateStep = (step: 1 | 2 | 3, formData: FormData): FormErrors => {
        const errors: FormErrors = {};
        if (step === 1) {
            if (!formData.name) errors.name = 'name required';
            else if (formData.name.length < 2) errors.name = 'name is too short';
            if (!formData.lastName) errors.lastName = 'last name required';
        }
        if (step === 2) {
            if (!formData.city) errors.city = 'city required';
            else if (formData.city.length < 2) errors.city = 'city is too short';
            if (!formData.zip) errors.zip = 'zip required';
        }
        return errors;
    };

    const handleNext = (step: 1 | 2 | 3, formData: FormData) => {
        const errors = validateStep(step, formData);
        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }
        setErrors({});
        setStep(s => Math.min(s + 1, 3) as 1 | 2 | 3);
    };

    const handlePrev = () => {
        setErrors({});
        setStep(s => Math.max(s - 1, 1) as 1 | 2 | 3);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (step < 3) {
            handleNext(step, formData);
        } else {
            console.log("wyślij", formData);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {step === 1 && (
                <>
                    <div>
                        <label htmlFor="name">name</label>
                        <input
                            className="border border-gray-200 p-1 rounded ml-2"
                            onChange={handleChange('name')}
                            id="name"
                            value={formData.name}
                            aria-invalid={!!errors.name}
                        />
                        {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
                    </div>
                    <div>
                        <label htmlFor="lastName">last name</label>
                        <input
                            className="border border-gray-200 p-1 rounded ml-2"
                            onChange={handleChange('lastName')}
                            id="lastName"
                            value={formData.lastName}
                            aria-invalid={!!errors.lastName}
                        />
                        {errors.lastName && <p className="text-red-600 text-sm">{errors.lastName}</p>}
                    </div>

                    <p>{step} z 3</p>

                    <div className="flex justify-center gap-2 mt-2">
                        <button type="submit" className="border border-gray-300 px-2 py-1">next</button>
                    </div>
                </>
            )}

            {step === 2 && (
                <>
                    <div>
                        <label htmlFor="city">city</label>
                        <input
                            className="border border-gray-200 p-1 rounded ml-2"
                            onChange={handleChange('city')}
                            id="city"
                            value={formData.city}
                            aria-invalid={!!errors.city}
                        />
                        {errors.city && <p className="text-red-600 text-sm">{errors.city}</p>}
                    </div>
                    <div>
                        <label htmlFor="zip">zip</label>
                        <input
                            className="border border-gray-200 p-1 rounded ml-2"
                            onChange={handleChange('zip')}
                            id="zip"
                            value={formData.zip}
                            aria-invalid={!!errors.zip}
                        />
                        {errors.zip && <p className="text-red-600 text-sm">{errors.zip}</p>}
                    </div>

                    <p>{step} z 3</p>

                    <div className="flex justify-center gap-2 mt-2">
                        <button type="button" className="border border-gray-300 px-2 py-1" onClick={handlePrev}>prev</button>
                        <button type="submit" className="border border-gray-300 px-2 py-1">next</button>
                    </div>
                </>
            )}

            {step === 3 && (
                <>
                    <div>
                        <p>name <strong>{formData.name}</strong></p>
                        <p>last name <strong>{formData.lastName}</strong></p>
                        <p>city <strong>{formData.city}</strong></p>
                        <p>zip <strong>{formData.zip}</strong></p>
                    </div>

                    <p>{step} z 3</p>

                    <div className="flex justify-center gap-2 mt-2">
                        <button type="button" className="border border-gray-300 px-2 py-1" onClick={handlePrev}>prev</button>
                        <button autoFocus  type="submit" className="border border-blue-300 bg-blue-300 text-white px-2 py-1">submit form</button>
                    </div>
                </>
            )}
        </form>
    );
}