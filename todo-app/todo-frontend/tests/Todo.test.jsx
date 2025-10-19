import { expect, test } from "vitest"
import { render } from "@testing-library/react"
import { Todo } from "../src/Todos/List"

test("todo component works", () => {
    render(<Todo todo={{ text: "I must do this", done: false }} onClickComplete={() => null} onClickDelete={() => null} />)
    expect(document.querySelector("#todoText")?.textContent).toBe("I must do this")
    expect(document.querySelector("#todoIsDone")?.textContent).toBe("This todo is not done")
})