var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var express = require('express');
var Meme = /** @class */ (function () {
    function Meme(id, price, src, name) {
        this.data = {
            id: id,
            price: price,
            src: src,
            name: name
        };
        this.priceHistory = [];
        this.priceHistory.push(price);
    }
    Meme.prototype.change_price = function (price) {
        this.data.price = price;
        this.priceHistory.push(price);
    };
    Meme.prototype.toString = function () {
        return JSON.stringify(this.data);
    };
    return Meme;
}());
var memesArray;
function populateMemes() {
    memesArray = [];
    for (var i = 0; i < 17; i++) {
        memesArray.push(new Meme(i, Math.floor(Math.random() * 10000), '/images/mem' + i.toString() + '.jpg', 'TwojaStara'));
    }
}
populateMemes();
function most_expensive() {
    var res;
    res = [];
    var memesCopy = __spreadArrays(memesArray);
    memesCopy.sort(function (a, b) {
        return (b.data.price - a.data.price);
    });
    for (var i = 0; i < Math.min(memesCopy.length, 3); i++) {
        res.push(JSON.parse(memesCopy[i].toString()));
    }
    return res;
}
var app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'pug');
app.get('/', function (req, res) {
    res.render('index', { title: 'Meme market', message: 'Hello there!', memes: most_expensive() });
});
var port = 3000;
app.listen(port, function () {
    console.log('App is listening on port ' + port);
});
function get_meme(id) {
    return memesArray[id];
}
app.get('/meme/:memeId', function (req, res) {
    var meme = get_meme(parseInt(req.params.memeId));
    res.render('meme', { meme: JSON.parse(meme.toString()), prices: __spreadArrays(meme.priceHistory).reverse() });
});
app.post('/meme/:memeId', function (req, res) {
    var meme = get_meme(req.params.memeId);
    var price = req.body.price;
    meme.change_price(price);
    res.render('meme', { meme: JSON.parse(meme.toString()), prices: __spreadArrays(meme.priceHistory).reverse() });
});
