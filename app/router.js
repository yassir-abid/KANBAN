const express = require('express');

const controllerHandler = require('./helpers/controllerHandler');
const { errorHandler, ApiError } = require('./helpers/errorHandler');

const { listController } = require('./controllers');

const router = express.Router();

/** LIST */
router.get('/lists', controllerHandler(listController.getAll));
router.get('/lists/:id(\\d+)', controllerHandler(listController.getOne));
router.post('/lists', controllerHandler(listController.create));
router.patch('/lists/:id(\\d+)', controllerHandler(listController.update));

router.use(() => {
    throw new ApiError('Page not found', { statusCode: 404 });
});

router.use((err, _, response, next) => {
    errorHandler(err, response, next);
});

module.exports = router;
