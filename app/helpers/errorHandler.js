const path = require('path');
const logger = require('./logger');
const ApiError = require('../errors/apiError');

/**
 * Middleware that respond to a next method with an error as argument
 * @param {object} err Error class
 * @param {object} res Express response object
 */
const errorHandler = (err, res) => {
    let statusCode = err.infos?.statusCode;

    if (!statusCode || Number.isNaN(Number(statusCode))) {
        statusCode = 500;
    }

    if (statusCode === 500) {
        logger.error(err);
    }

    if (statusCode === 404) {
        res.sendFile(path.join(__dirname, '../../assets/page404.html'));
    }
};

module.exports = {
    ApiError,
    errorHandler,
};
