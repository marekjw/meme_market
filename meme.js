"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Meme = void 0;
class Meme {
    constructor(id, price, src, name) {
        this.data = {
            id: id,
            price: price,
            src: src,
            name: name
        };
        this.priceHistory = [];
        this.priceHistory.push(price);
    }
    change_price(price) {
        this.data.price = price;
        this.priceHistory.push(price);
    }
    toString() {
        return JSON.stringify(this.data);
    }
}
exports.Meme = Meme;
