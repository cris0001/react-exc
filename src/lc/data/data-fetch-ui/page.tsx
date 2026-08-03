'use client'

import UsersList from "./UsersList";


export default function Page() {

    return (
        <>
            <UsersList/>
        </>
    )
}


// A paginated user list. Fetches one page at a time from an API and lets the user move between pages.
//
// API (this one supports pagination):
// https://reqres.in/api/users?page=1
//     Returns: { data: User[], total_pages: number, page: number }


//
// Requirements:
//
// fetch and display the current page of users (name + email)
// "Previous" / "Next" buttons to change page
// disable "Previous" on page 1, "Next" on the last page
// show the current page number ("Page 2 of 4")
// handle loading and error states
// refetch when the page changes
// proper cleanup (no race conditions when clicking fast)