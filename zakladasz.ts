const sqlite3 = require('sqlite3').verbose()


function zalozBaze() {
    sqlite3.verbose();
    let db = new sqlite3.Database('baza.db');
    db.run('CREATE TABLE IF NOT EXISTS historie (id INT PRIMARY KEY, historia TEXT);');
    db.run('CREATE TABLE IF NOT EXISTS memeData (id INT PRIMARY KEY, meme TEXT);');

    db.close();
}

function createRandomCode(length) {
    let randomCodes = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        randomCodes += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return randomCodes
}
createRandomCode(10)


function zapelnijBaze() {
    let db = new sqlite3.Database('baza.db')
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

function startHistorie() {
    let db = new sqlite3.Database('baza.db')

    db.each('SELECT id, meme FROM memeData', [], (err, res) => {
        if (err) {
            throw err
        }

        const cena = [JSON.parse(res.meme).price].toString()

        console.log(res.id, cena)

        db.run('INSERT INTO historie (id, historia) VALUES (?, ?);', [res.id, cena], (err) => {
            if (err)
                throw err
        })
    })

    db.close()

}



