import {useState, memo, useCallback} from "react"

type Product = { id: number; name: string; price: number }

const ProductRow = memo(({product, onSelect}: {
    product: Product
    onSelect: (id: number) => void
}) => {
    console.log(`render ${product.name}`)
    return (
        <li onClick={() => onSelect(product.id)}>
            {product.name} — {product.price} zł
        </li>
    )
})

function ProductList({products}: { products: Product[] }) {
    const [search, setSearch] = useState("")

    const filtered = products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    )


    // const handleSelect = (id: number) => {
    //     console.log("selected", id)
    // }

    //use Callback otherwise new fn every render

    const handleSelect = useCallback((id: number) => {
        console.log("selected", id)
    }, [])


    //breakes memo
    const style = {padding: 8, borderBottom: "1px solid #ccc"}

    return (
        <div>
            <input value={search} onChange={(e) => setSearch(e.target.value)}/>
            <ul>
                {filtered.map((p) => (
                    <ProductRow key={p.id} product={p} onSelect={handleSelect}/>
                ))}
            </ul>
        </div>
    )
}