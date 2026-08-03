// Typy domenowe koszyka.

export type Product = {
  id: number
  name: string
  price: number
}

// Pozycja w koszyku = produkt + ilość
export type CartItem = Product & {
  quantity: number
}
