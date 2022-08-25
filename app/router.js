const express = require('express');

const { errorHandler, ApiError } = require('./helpers/errorHandler');

const mainController = require('./controllers');

const router = express.Router();

router.get('/test', mainController.test);

router.use(() => {
    throw new ApiError('Page not found', { statusCode: 404 });
});

router.use((err, _, response, next) => {
    errorHandler(err, response, next);
});

module.exports = router;
