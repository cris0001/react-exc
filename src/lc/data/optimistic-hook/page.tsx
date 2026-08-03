'use client'

import {PostList} from "./PostList"

export default function Page() {
    return (
        <main className="p-8">
            <h1 className="text-xl mb-6">Posty (useOptimistic — React 19)</h1>
            <PostList/>
        </main>
    )
}


// ============================================================================
// TASK — OPTIMISTIC UPDATES WITH useOptimistic (React 19)
// ============================================================================
//
// Same feature again, this time using React's built-in useOptimistic.
//
// THE BIG DIFFERENCE
//   You do NOT write a rollback. There is nothing to roll back to, because
//   the optimistic value was never really stored — it is a temporary overlay
//   on top of the real state, and React drops it automatically when the
//   async action finishes (whether it succeeded or failed).
//
// HOW IT WORKS
//   const [optimisticPosts, addOptimistic] = useOptimistic(posts, reducerFn)
//
//   - `posts`           the REAL state (only updated by confirmed data)
//   - `optimisticPosts` what you RENDER — real state + pending optimistic changes
//   - `addOptimistic`   queues an optimistic change for the current action
//   - `reducerFn`       (currentState, optimisticValue) => newState
//
//   While a transition is pending, React renders `optimisticPosts`.
//   When it settles, React throws the overlay away and shows `posts` again.
//   If the request failed, `posts` never changed — so the UI "rolls back"
//   without you writing a single line of rollback code.
//
// THE CATCH
//   addOptimistic only works inside a transition (an async function passed to
//   a form action, or wrapped in startTransition). Call it outside one and
//   React warns and the update does not stick.
//
// Think about:
//   - why is there no snapshot here? what replaced it?
//   - what is the difference between `posts` and `optimisticPosts`?
//   - why must the optimistic reducer be pure?
//   - what do you lose compared to the manual version?
//
// REQUIRES React 19+. On React 18 use the manual version.
// ============================================================================
