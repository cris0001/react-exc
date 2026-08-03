'use client'

import {PostList} from "./PostList"

export default function Page() {
    return (
        <main className="p-8">
            <h1 className="text-xl mb-6">Posty (optimistic — useState)</h1>
            <PostList/>
        </main>
    )
}


// ============================================================================
// TASK — OPTIMISTIC UPDATES WITH useState
// ============================================================================
//
// Same feature as the useReducer version: a list of posts you can like and
// delete, with instant UI feedback and rollback on failure.
//
// This time WITHOUT a reducer — plain useState only.
//
// REQUIREMENTS (identical)
//   - like updates the counter instantly, rolls back on error
//   - delete removes the row instantly, restores it AT ITS ORIGINAL INDEX on error
//   - no duplicate requests for the same post
//   - the API fails ~30% of the time
//
// THE POINT OF THIS VARIANT
//   Notice what changes and what does NOT:
//     - the four-step pattern (snapshot -> optimistic -> request -> rollback)
//       is IDENTICAL. It is not a reducer thing.
//     - you no longer need a ref for fresh state, because updaters
//       (setState(prev => ...)) always receive the current value from React.
//     - you DO need a ref for the pending guard, because reading state
//       to decide "should I even start" is not something an updater can do.
//     - state transitions are now spread across handlers instead of living
//       in one pure function — harder to unit test.
//
// Think about:
//   - which parts got simpler, which got harder to test?
//   - why does setPosts(prev => ...) remove the need for stateRef?
//   - why can't the pending guard use an updater?
//   - at what point would you switch back to useReducer?
// ============================================================================
