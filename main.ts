const express = require('express')
const csrf = require('csurf')
const cookiePareser = require('cookie-parser')
const bodyParser = require('body-parser')

const csrfProtection = csrf({ cookie: true })
const parseForm = bodyParser.urlencoded({ extended: false })

type memeJSON = {
    id: number
    price: number
    src: string
    name: string
}

class Meme {
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


let memesArray: Meme[]

function populateMemes() {
    memesArray = []
    for (let i = 0; i < 17; i++) {
        memesArray.push(new Meme(i, Math.floor(Math.random() * 10000), '/images/mem' + i.toString() + '.jpg', 'TwojaStara'))
    }
}

populateMemes()


function most_expensive(): JSON[] {
    let res: JSON[]
    res = []
    let memesCopy: Meme[] = [...memesArray]

    memesCopy.sort((a: Meme, b: Meme) => {
        return (b.data.price - a.data.price)
    })

    for (let i = 0; i < Math.min(memesCopy.length, 3); i++) {
        res.push(JSON.parse(memesCopy[i].toString()))
    }

    return res
}

let app = express()

app.set('view engine', 'pug')

app.use(express.static('public'));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookiePareser())





app.get('/', function (req, res) {
    res.render('index', { title: 'Meme market', message: 'Hello there!', memes: most_expensive() })
});

const port = 3000
app.listen(port, () => {
    console.log('App is listening on port ' + port)
})



function get_meme(id: number): Meme {
    return memesArray[id]
}



app.get('/meme/:memeId', csrfProtection, (req, res) => {
    let meme = get_meme(parseInt(req.params.memeId))
    res.render('meme', { meme: JSON.parse(meme.toString()), prices: [...meme.priceHistory].reverse(), csrfToken: req.csrfToken() })
})



app.post('/meme/:memeId', function (req, res) {
    let meme = get_meme(req.params.memeId);
    let price = req.body.price;
    meme.change_price(price)
    res.render('meme', { meme: JSON.parse(meme.toString()), prices: [...meme.priceHistory].reverse() })
})