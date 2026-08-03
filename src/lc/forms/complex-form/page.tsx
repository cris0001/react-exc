'use client'

import {OrderForm} from "./OrderForm"

export default function Page() {
    return (
        <main className="p-8">
            <h1 className="text-xl mb-6">Zamówienie</h1>
            <OrderForm/>
        </main>
    )
}


// ============================================================================
// TASK — COMPLEX FORM (dynamic fields + cross-field validation)
// ============================================================================
//
// Build an order form with React Hook Form + Zod.
//
// FIELDS
//   - customer email                      required, valid email
//   - line items (DYNAMIC, at least 1)    description, quantity, unit price
//       * "Add item" / "Remove item" buttons
//       * cannot remove the last remaining item
//   - payment method                      "card" | "transfer"
//   - card number                         required ONLY when method === "card"
//   - discount code                       optional
//
// VALIDATION RULES
//   - every line item: description non-empty, quantity >= 1, unit price > 0
//   - CROSS-FIELD: card number required only if payment method is "card"
//   - CROSS-FIELD: discount code "SAVE10" only valid if the order total >= 100
//   - show the running total, recalculated as the user types
//
// SUBMIT
//   - disabled while submitting
//   - show a success message, or a server error
//
// Think about:
//   - where does the validation live so it can be unit-tested without React?
//   - how do you validate a field against ANOTHER field's value? (Zod .refine / .superRefine)
//   - how do you attach a cross-field error to a specific input? (path in the issue)
//   - how do you read live values for the running total? (watch)
//   - why are uncontrolled inputs (register) better here than useState per field?
//
// npm i react-hook-form zod @hookform/resolvers
//
// NOTE ON MULTI-STEP WIZARDS (asked about, not built here):
//   Keep ONE form instance across steps and split the schema per step
//   (z.object per step, validated with trigger(["field1","field2"]) before
//   advancing). Do NOT create a separate form per step — you lose values
//   when going back. Step index lives in useState, form state stays in RHF.
// ============================================================================
