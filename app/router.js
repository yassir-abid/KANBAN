const express = require('express');

const { errorHandler } = require('./helpers/errorHandler');

const mainController = require('./controllers');

const router = express.Router();

router.get('/test', mainController.test);

router.use((err, _, response, next) => {
    errorHandler(err, response, next);
});

module.exports = router;
