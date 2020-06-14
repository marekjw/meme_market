import sqlite3 from 'sqlite3'
import { Meme, PriceRecord } from './meme'
import { resolve } from 'dns'
import { rejects } from 'assert'
const sqlite: sqlite3.sqlite3 = sqlite3.verbose()

//memeData (meme_id INT PRIMARY KEY, src TEXT, price INT)
//prices (meme_id INT, user_id INT, time INT, price INT);
//users (user_id INT PRIMARY KEY, username TEXT, password TEXT)
const sqlGetMeme = `
        SELECT meme_id AS id, src, price
        FROM memeData
        WHERE meme_id = ?
    `

function prGetMeme(id: number): Promise<Meme> {
    return new Promise((resolve, rejects) => {
        const db = new sqlite.Database('base.db')
        db.get(sqlGetMeme, [id], (err, meme) => {
            db.close()
            if (err)
                rejects(err)
            resolve(meme as Meme)
        })
    })
}

const sqlGetHistory = `
        SELECT prices.price AS price, users.username AS username
        FROM prices
        INNER JOIN users 
        ON prices.user_id = users.user_id
        WHERE meme_id = ?
        ORDER BY time DESC
    `

function prGetHistory(id: number): Promise<PriceRecord[]> {
    return new Promise((resolve, rejects) => {
        const db = new sqlite.Database('base.db')
        db.all(sqlGetHistory, [id], (err, history) => {
            db.close()
            if (err)
                rejects(err)
            resolve(history as PriceRecord[])
        })
    })
}

export function getMeme(id: number): Promise<[Meme, PriceRecord[]]> {
    return Promise.all([prGetMeme(id), prGetHistory(id)])
}


const sqlGetTopPriced = `
            SELECT meme_id AS id, src, price 
            FROM memeData
            ORDER BY price DESC 
            LIMIT 3
    `
export function getTopPriced(n: number): Promise<Meme[]> {
    return new Promise((resolve, rejects) => {
        const db = new sqlite.Database('base.db')
        db.all(sqlGetTopPriced, [], (err, res) => {
            db.close()
            if (err)
                rejects(err)
            resolve(res as Meme[])
        })
    })
}

const sqlInsertPriceRecord = `
        INSERT INTO PRICES (meme_id, price, user_id, time) VALUES (?, ?, ?, ?)
    `
const sqlUpdatePrice = `UPDATE memeData SET price = ? WHERE meme_id = ?`

export function changePrice(meme_id: number, price: number, user_id: number, time: number): Promise<[void, void]> {
    return Promise.all([
        new Promise<void>((resolve, rejects) => {
            const db = new sqlite.Database('base.db')
            db.run(sqlInsertPriceRecord, [meme_id, price, user_id, time], (err) => {
                db.close()
                if (err)
                    rejects(err)
                resolve()
            })
        }),
        new Promise<void>((resolve, rejects) => {
            const db = new sqlite.Database('base.db')
            db.run(sqlUpdatePrice, [price, meme_id], (err) => {
                db.close()
                if (err)
                    rejects(err)
                resolve()
            })
        })
    ])
}