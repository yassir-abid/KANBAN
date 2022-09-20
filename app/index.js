const express = require('express');
const session = require('express-session');
const cors = require('cors');
const multer = require('multer');

const bodyParser = multer();

const router = require('./router');

const app = express();

app.use(session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: (1000 * 60 * 60),
    },
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.none());

app.use(cors({
    origin: process.env.CORS_DOMAINS ?? '*',
}));

app.use(express.static('./assets'));

app.use(router);

module.exports = app;
