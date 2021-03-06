import express from "express"
import csrf from 'csurf'
import cookiePareser from 'cookie-parser'
import bodyParser from 'body-parser'
import { prGetUser } from './userDB'

import { Meme } from './meme'
import { getMeme, getTopPriced, changePrice } from "./memeDB"
import { stringify } from "querystring"
import { Session } from "inspector"

import session from 'express-session'

let SQLiteStore = require('connect-sqlite3')(session)

const csrfProtection = csrf({ cookie: true })
const parseForm = bodyParser.urlencoded({ extended: false })

let app = express()

app.set('view engine', 'pug')

app.use(express.static('public'));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookiePareser())

app.set('trust proxy', 1)

const age15Minutes = 15 * 60 * 1000
app.use(session({ store: new SQLiteStore, secret: 'elo wale wiadro', cookie: { maxAge: age15Minutes } }))

app.get('*', (req, res, next) => {
    if (req.session.views) {
        req.session.views++
    } else {
        req.session.views = 1
    }
    next()
})


app.get('/', function (req, res) {
    getTopPriced(3).then((memeList) => {
        res.render('index', { memes: memeList, title: 'Meme market', views: req.session.views, username: req.session.username })
    }).catch((reason) => {
        console.log(reason)
        res.render('error', { title: 'ERROR', username: req.session.username })
    })
});

const port = 3000
app.listen(port, () => {
    console.log('App is listening on port ' + port)
})




app.get('/meme/:memeId', csrfProtection, (req, res) => {
    getMeme(parseInt(req.params.memeId))
        .then(([meme_res, history]) => {
            res.render('meme', { meme: meme_res, priceHistory: history, views: req.session.views, username: req.session.username, csrfToken: req.csrfToken() })
        }).catch((reason) => {
            console.log('Error at get /meme/', req.params.memeId)
            console.log(reason)
            res.render('error', { message: "Couldn't get the meme", username: req.session.username })
        })
})


app.post('/meme/:memeId', csrfProtection, function (req, res) {

    if (req.session.loggedin) {
        if (!req.body.price)
            res.redirect('/meme/' + req.params.memeId)
        else {
            const d = new Date()
            changePrice(parseInt(req.params.memeId), req.body.price, req.session.user_id, d.getTime()).then(() => {
                res.redirect('/meme/' + req.params.memeId)
            }).catch((reason) => {
                console.log(reason)
                res.render('error', { message: 'could not change price' })
            })
        }
    } else {
        res.redirect('/meme/' + req.params.memeId)
    }
})

app.get('/login', (req, res) => {
    res.render('login', { title: 'Login to meme market', views: req.session.views, isLoginPage: true })
})

app.post('/auth', function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        prGetUser(username, password).then((id) => {
            if (id >= 0) {
                req.session.loggedin = true;
                req.session.username = username;
                req.session.user_id = id
                res.redirect('/');
            } else {
                res.render('login', { invalid: true, isLoginPage: true })
            }
        }).catch((reason) => {
            console.log('error at login')
            console.log(reason)
            res.render('error', { message: 'Something went wrong' })
        })
    } else {
        res.render('login', { missing: true, isLoginPage: true });
    }
});

app.get('/signout', (req, res) => {
    if (req.session.loggedin) {
        delete req.session['username']
        delete req.session['loggedin']
    }
    res.redirect('/')
})