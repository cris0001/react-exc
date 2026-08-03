import type {OrderFormOutput} from "./schema"

// Warstwa API osobno — żeby dało się ją zamockować w testach (vi.mock).
// Gdyby submitOrder siedziało w komponencie, nie byłoby czego podmienić.

export async function submitOrder(order: OrderFormOutput): Promise<{ id: number }> {
    await new Promise((resolve) => setTimeout(resolve, 800))

    if (order.email.endsWith("@blocked.com")) {
        throw new Error("Ten adres email jest zablokowany")
    }

    return {id: Math.floor(Math.random() * 10000)}
}
