"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const csurf_1 = __importDefault(require("csurf"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const meme_1 = require("./meme");
const csrfProtection = csurf_1.default({ cookie: true });
const parseForm = body_parser_1.default.urlencoded({ extended: false });
let memesArray;
function populateMemes() {
    memesArray = [];
    for (let i = 0; i < 17; i++) {
        memesArray.push(new meme_1.Meme(i, Math.floor(Math.random() * 10000), '/images/mem' + i.toString() + '.jpg', 'TwojaStara'));
    }
}
populateMemes();
function most_expensive() {
    let res;
    res = [];
    let memesCopy = [...memesArray];
    memesCopy.sort((a, b) => {
        return (b.data.price - a.data.price);
    });
    for (let i = 0; i < Math.min(memesCopy.length, 3); i++) {
        res.push(JSON.parse(memesCopy[i].toString()));
    }
    return res;
}
let app = express_1.default();
app.set('view engine', 'pug');
app.use(express_1.default.static('public'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(cookie_parser_1.default());
app.get('/', function (req, res) {
    res.render('index', { title: 'Meme market', message: 'Hello there!', memes: most_expensive() });
});
const port = 3000;
app.listen(port, () => {
    console.log('App is listening on port ' + port);
});
function get_meme(id) {
    return memesArray[id];
}
app.get('/meme/:memeId', csrfProtection, (req, res) => {
    let meme = get_meme(parseInt(req.params.memeId));
    res.render('meme', { meme: JSON.parse(meme.toString()), prices: [...meme.priceHistory].reverse(), csrfToken: req.csrfToken() });
});
app.post('/meme/:memeId', function (req, res) {
    let promise = new Promise((resolve, reject) => {
        let meme = get_meme(parseInt(req.params.memeId));
        resolve();
    });
    promise.then((meme) => {
        let price = req.body.price;
        meme.change_price(price);
        res.render('meme', { meme: JSON.parse(meme.toString()), prices: [...meme.priceHistory].reverse() });
    });
});
