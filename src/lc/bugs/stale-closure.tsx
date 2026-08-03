import {useState, useEffect} from "react"

function Counter() {
    const [count, setCount] = useState(0)

    // BUG 1: dodaje tylko 1 zamiast 3
    const addThree = () => {
        setCount(count + 1)
        setCount(count + 1)
        setCount(count + 1)
    }

    // BUG 2: licznik zatrzymuje się na 1
    const startAuto = () => {
        setInterval(() => {
            setCount(count + 1)
        }, 1000)
    }

    // BUG 3: dodaje starą wartość, nie aktualną
    const addLater = () => {
        setTimeout(() => {
            setCount(count + 1)
        }, 2000)
    }

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={addThree}>+3</button>
            <button onClick={startAuto}>Start auto</button>
            <button onClick={addLater}>Add later</button>
        </div>
    )
}

//bug 1- functional updater
// bug 2-