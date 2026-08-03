'use client'

import {TicketForm} from "./TicketForm"

export default function Page() {
    return (
        <main className="p-4 sm:p-8">
            <h1 className="text-xl mb-6">Nowe zgłoszenie</h1>
            <TicketForm/>
        </main>
    )
}


// ============================================================================
// TASK — TICKET FORM (Controller + reset + setError + discriminatedUnion)
// ============================================================================
//
// A "create ticket" form. Short, but it covers the three things the previous
// form task did not.
//
// FIELDS
//   title       plain text input          required, 3-80 chars
//   category    CUSTOM Select component   required
//   type        radio: "bug" | "feature"
//   ...then ONE of, depending on type:
//     stepsToReproduce   (type === "bug")      required, min 10 chars
//     businessValue      (type === "feature")  required, min 10 chars
//
// THE THREE NEW THINGS
//
//   1. Controller
//      The Select in Select.tsx is a custom component with value/onChange
//      props — like anything from MUI, Ant, react-select, or a date picker.
//      register() will NOT work on it: there is no DOM input to attach a ref
//      to. Controller bridges the gap.
//
//   2. reset()
//      After a successful submit, clear the form back to its defaults.
//      Without reset the user stares at their already-sent data.
//
//   3. setError()
//      The API rejects duplicate titles with a FIELD-SPECIFIC error.
//      That error must land on the title input, not in a generic banner.
//
//   4. (bonus) cross-field validation, flat schema
//      "which field is required" depends on the `type` field. The obvious
//      Zod tool for this is z.discriminatedUnion — but it fights RHF, because
//      useForm<T> needs T to list EVERY possible field for register() to be
//      statically checkable. A union says "either these fields or those",
//      and TS cannot tell which variant is active.
//      So: flat object + superRefine here. See schema.ts for the full
//      trade-off and when a union IS the right call.
//
// Think about:
//   - why can't register() handle a component that has no <input> inside?
//   - what does Controller actually give the child component?
//   - reset() with no argument vs reset(values) — what is the difference?
//   - why does a server error need setError instead of a plain useState?
//   - discriminatedUnion vs flat + superRefine: which one, and why?
//   - what does TypeScript lose when you flatten the schema?
//
// Try the API with the title "duplikat" to see the server-side field error.
// ============================================================================
