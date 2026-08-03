'use client'

import {PostList} from "./PostList"

export default function Page() {
    return (
        <main className="p-8">
            <h1 className="text-xl mb-6">Posty (optimistic updates)</h1>
            <PostList/>
        </main>
    )
}


// ============================================================================
// TASK — OPTIMISTIC UPDATES
// ============================================================================
//
// A list of posts you can like and delete. The UI must react INSTANTLY,
// and roll back cleanly when the server rejects the change.
//
// REQUIREMENTS
//   - clicking "Like" updates the counter immediately, before the request finishes
//   - if the request fails, the counter goes BACK to its previous value
//     and an error message appears
//   - the same for delete: the row disappears immediately, and comes back
//     (in its original position) if the request fails
//   - clicking like several times fast must not corrupt the count
//   - a request that is already in flight must not be duplicated
//   - the API deliberately fails ~30% of the time so you can see the rollback
//
// Think about:
//   - where do you keep the value to roll back to? (state or ref? why?)
//   - what if TWO likes are in flight and the first one fails — what is
//     "the previous value" then?
//   - deleting item #3 of 5: how do you restore it in the RIGHT position?
//   - why must the reducer stay pure when the whole point is a side effect?
//   - what does the user see if the rollback is slower than their next click?
//
// PRODUCTION NOTE:
//   TanStack Query has this built in: onMutate (apply optimistic change +
//   snapshot), onError (restore the snapshot), onSettled (refetch to sync
//   with the server). Building it by hand shows you understand what those
//   three callbacks actually do.
// ============================================================================
