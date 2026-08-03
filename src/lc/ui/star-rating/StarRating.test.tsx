import {describe, it, vi, expect, beforeEach} from "vitest"
import {render, screen} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {StarRating} from "./StarRating";


// renders 5 stars
// calls onChange with the star number when clicked
// calls onChange with 0 when clicking the already-selected star
// fills stars up to the selected value


describe("StarRating", () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("renders 5 stars", () => {
        render(<StarRating value={0} onChange={() => {
        }}/>)
        expect(screen.getAllByRole("button")).toHaveLength(5)
    })

    it("calls onChange with the star number when clicked", async () => {

        const onChange = vi.fn()
        const user = userEvent.setup()
        render(<StarRating value={0} onChange={onChange}/>)

        await user.click(screen.getByRole("button", {name: "3 stars"}))
        expect(onChange).toHaveBeenCalledWith(3)
    })


    it('calls onChange with 0 when clicking the already-selected star', async () => {
        const onChange = vi.fn()
        const user = userEvent.setup()

        render(<StarRating value={3} onChange={onChange}/>)
        await user.click(screen.getByRole("button", {name: "3 stars"}))
        expect(onChange).toHaveBeenCalledWith(0)

    })

    it("fills stars up to the selected value", () => {
        render(<StarRating value={3} onChange={vi.fn()}/>)

        //expect(screen.getByRole("button", { name: "3 stars" })).toHaveAttribute("aria-pressed", "true")
        //requeires  aria-pressed={isFilled}

        expect(screen.getByRole("button", {name: "1 stars"})).toHaveClass("bg-yellow-300")
        expect(screen.getByRole("button", {name: "3 stars"})).toHaveClass("bg-yellow-300")
        expect(screen.getByRole("button", {name: "4 stars"})).not.toHaveClass("bg-yellow-300")
    })

    it("previews the rating on hover", async () => {
        const user = userEvent.setup()
        render(<StarRating value={0} onChange={vi.fn()}/>)

        await user.hover(screen.getByRole("button", {name: "3 stars"}))

        // stars 1–3 should preview as filled, even though value is 0
        expect(screen.getByRole("button", {name: "2 stars"})).toHaveClass("bg-yellow-300")
        expect(screen.getByRole("button", {name: "4 stars"})).not.toHaveClass("bg-yellow-300")
    })

})

