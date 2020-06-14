import sqlite3 from 'sqlite3'
import { resolve } from 'dns';
import { rejects } from 'assert';
import { stringify } from 'querystring';

const sqlite: sqlite3.sqlite3 = sqlite3.verbose()

function createDatabase() {
    let db = new sqlite.Database('base.db')
    db.run('CREATE TABLE IF NOT EXISTS memeData (meme_id INT PRIMARY KEY, src TEXT, price INT);');
    db.run('CREATE TABLE IF NOT EXISTS prices (meme_id INT, user_id INT, time INT, price INT);')
    db.run('CREATE TABLE IF NOT EXISTS users (user_id INT PRIMARY KEY, username TEXT, password TEXT);')

    db.close();
}

function fillDatabase() {
    let db = new sqlite.Database('base.db')
    for (let i = 0; i < 17; i += 1) {


        const src = 'images/mem' + i.toString() + '.jpg'

        db.run('INSERT INTO memeData (meme_id, src, price) VALUES (?, ?, ?)', [i, src, Math.floor(Math.random() * 10000)], (err) => {
            if (err) {
                throw err
            }
        })
    }

    db.run('INSERT INTO users (user_id, username, password) VALUES (?, ?, ?)', [0, 'admin', 'xdd'])

    db.close()

}


function startPriceHistory() {
    let db = new sqlite.Database('base.db')

    db.each('SELECT meme_id, price FROM memeData', [], (err, res) => {
        if (err) {
            throw err
        }

        console.log(res)

        db.run('INSERT INTO prices (meme_id, user_id, time, price) VALUES (?, ?, ?, ?);', [res.meme_id, 0, Date.now(), res.price], (err) => {
            if (err)
                throw err
        })

    })

    db.close()

}
