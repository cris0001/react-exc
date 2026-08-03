'use client'

import {InfiniteList} from "./InfiniteList"

export default function Page() {
    return (
        <main className="p-8">
            <h1 className="text-xl mb-6">Posty (infinite scroll)</h1>
            <InfiniteList/>
        </main>
    )
}


// ============================================================================
// TASK — INFINITE SCROLL
// ============================================================================
//
// Load more items automatically when the user scrolls near the bottom.
//
// API
//   https://jsonplaceholder.typicode.com/posts?_page=1&_limit=10
//   Returns an array of { id, title, body, userId }.
//   An empty array means there are no more pages.
//
// REQUIREMENTS
//   - load the first page on mount
//   - when a sentinel element at the bottom becomes visible, load the next page
//   - APPEND new items to the existing list (do not replace)
//   - show a loading indicator while fetching the next page
//   - stop fetching when the API returns fewer items than the page size
//   - show "That's everything" at the end
//   - no duplicate requests (scrolling fast must not fire the same page twice)
//   - proper cleanup: disconnect the observer, abort in-flight requests
//   - a "Load more" button as a fallback (a11y + when JS scroll fails)
//
// Think about:
//   - IntersectionObserver vs a scroll listener — why is the observer better?
//   - the sentinel: where do you put it and what does it need to be?
//   - how do you guard against firing the same page twice while one is in flight?
//     (state is deferred — does a state guard work here?)
//   - the observer callback captures values from the render it was created in.
//     How do you avoid a stale closure?
//   - what has to be in the observer effect's dependency array?
//
// PRODUCTION NOTE:
//   TanStack Query's useInfiniteQuery does the page accumulation, caching,
//   dedup and "hasNextPage" bookkeeping for you. Write it by hand once to
//   understand it, use the library in real projects.
// ============================================================================
