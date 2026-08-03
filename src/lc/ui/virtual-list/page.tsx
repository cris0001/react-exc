'use client'

import {VirtualList} from "./VirtualList"
import {SimpleVirtualList} from "./SimpleVirtualList"

export default function Page() {
    return (
        <main className="p-8 flex flex-col gap-10">
            <section>
                <h1 className="text-xl mb-4">Ręczna wirtualizacja (mechanizm)</h1>
                <SimpleVirtualList/>
            </section>

            <section>
                <h1 className="text-xl mb-4">@tanstack/react-virtual (produkcyjnie)</h1>
                <VirtualList/>
            </section>
        </main>
    )
}


// ============================================================================
// TASK — VIRTUALIZED LIST
// ============================================================================
//
// Render a list of 10 000 items without killing the browser.
//
// PART 1 — hand-rolled (to prove you understand the mechanism)
//   Build a virtualized list from scratch. Fixed row height is fine.
//   - only render the rows that are actually visible (+ a small overscan buffer)
//   - the scrollbar must behave as if all 10 000 rows were there
//   - rows must be positioned so they line up with the scroll offset
//   - scrolling must stay smooth (no re-render storm)
//
// PART 2 — with a library
//   Same list using @tanstack/react-virtual.
//   Add a "scroll to random item" button to show programmatic scrolling.
//
// Think about:
//   - how many rows do you actually need in the DOM? (container height / row height)
//   - what keeps the scroll height correct if the rows aren't there?
//   - how do you place a row at the right vertical position?
//   - why is `overscan` needed at all?
//
// Trade-offs to be able to name out loud:
//   - SEO: virtualized rows are NOT in the DOM, so crawlers don't see them
//   - a11y: screen readers and Ctrl+F only see the rendered window
//   - variable row heights are much harder (needs measurement)
//   - for small lists it's pure overhead — pagination is often simpler and better
//
// npm i @tanstack/react-virtual
// ============================================================================
