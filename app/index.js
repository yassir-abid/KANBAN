const express = require('express');
const cors = require('cors');
const multer = require('multer');

const bodyParser = multer();

const router = require('./router');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.none());

app.use(cors({
    origin: process.env.CORS_DOMAINS ?? '*',
}));

app.use(router);

module.exports = app;
