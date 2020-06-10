
type memeJSON = {
    id: number
    price: number
    src: string
    name: string
}

export class Meme {
    data: memeJSON
    priceHistory: number[]

    constructor(id: number, price: number, src: string, name: string) {
        this.data = {
            id: id,
            price: price,
            src: src,
            name: name
        }
        this.priceHistory = []
        this.priceHistory.push(price)
    }

    public change_price(price: number): void {
        this.data.price = price
        this.priceHistory.push(price)
    }

    public toString(): string {
        return JSON.stringify(this.data)
    }
}
