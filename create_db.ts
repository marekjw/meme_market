import sqlite3 from 'sqlite3'
import { resolve } from 'dns';
import { rejects } from 'assert';
import { stringify } from 'querystring';

const sqlite: sqlite3.sqlite3 = sqlite3.verbose()

function createDatabase() {
    let db = new sqlite.Database('base.db')
    db.run('CREATE TABLE IF NOT EXISTS memeData (id INT PRIMARY KEY, meme TEXT, price INT);');
    db.run('CREATE TABLE IF NOT EXISTS priceHistory (id INT PRIMARY KEY, history TEXT);')

    db.close();
}

function createRandomCode(length: number) {
    let randomCodes = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        randomCodes += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return randomCodes
}

function fillDatabase() {
    let db = new sqlite.Database('base.db')
    for (let i = 0; i < 17; i += 1) {
        const meme = JSON.stringify(
            {
                'id': i,
                'src': 'images/mem' + i.toString() + '.jpg',
                'name': createRandomCode(5),
                'price': Math.floor(Math.random() * 10000),
            }
        )

        db.run('INSERT INTO memeData (id, meme) VALUES (?, ?)', [i, meme], (err) => {
            if (err) {
                throw err
            }
        })
    }

    db.close()

}


function startPriceHistory() {
    let db = new sqlite.Database('base.db')

    db.each('SELECT id, meme FROM memeData', [], (err, res) => {
        if (err) {
            throw err
        }

        let price: number[] = []

        const memeJSON = JSON.parse(res.meme)

        price.push(memeJSON.price)
        const priceString: string = price.toString()
        db.run('INSERT INTO priceHistory (id, history) VALUES (?, ?);', [res.id, priceString], (err) => {
            if (err)
                throw err
        })

    })

    db.close()

}
