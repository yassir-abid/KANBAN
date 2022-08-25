const express = require('express');
const cors = require('cors');

const router = require('./router');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors({
    origin: process.env.CORS_DOMAINS ?? '*',
}));

app.use(router);

module.exports = app;
