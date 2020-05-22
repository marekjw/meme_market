const express = require('express')
import * as sqlite3 from 'sqlite3';


const most_expensive = [
    {
        'id': 10,

        'name': 'Gold',

        'price': 1000,

        'src': 'images/mem10.jpg'
    },

    {
        'id': 9,

        'name': 'Platinum',

        'price': 1100,

        'src': 'images/mem15.jpg'
    },

    {
        'id': 8,

        'name': 'Elite',

        'price': 1200,

        'src': 'images/mem13.jpg'
    }

]

type memeJSON = {
    id: number;
    src: string;
    price: number;
    name: string;
}

class meme {
    data: memeJSON

    constructor(jsonString: string) {
        this.data = JSON.parse(jsonString)
    }

    public change_price(price: number): void {

    }
}

let app = express()
app.use(express.static('public'));

app.set('view engine', 'pug')

app.get('/', function (req, res) {
    res.render('index', { title: 'Meme market', message: 'Hello there!', memes: most_expensive })
});

const port = 3000
app.listen(port, () => {
    console.log('App is listening on port ' + port)
})


function get_meme(id: number) {
    sqlite3.verbose()
    let db = new sqlite3.Database('baza.db')

    db.get('SELECT meme FROM data WHERE id=?', [id], (err, row) => {
        if (err) {
            throw err
        }

        if (row === undefined) {
            throw (new Error('there is no meme with such id'))
        }

        return new meme(row)
    })
}

app.post('/meme/:memeId', function (req, res) {
    let meme = get_meme(req.params.memeId);
    let price = req.body.price;
    meme.change_price(price);
    console.log(req.body.price);
    res.render('meme', { meme: meme })
})