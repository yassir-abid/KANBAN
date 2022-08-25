const express = require('express');

const controllerHandler = require('./helpers/controllerHandler');
const { errorHandler, ApiError } = require('./helpers/errorHandler');

const { listController, cardController, labelController } = require('./controllers');

const router = express.Router();

/** LIST */
router.get('/lists', controllerHandler(listController.getAll));
router.get('/lists/:id(\\d+)', controllerHandler(listController.getOne));
router.post('/lists', controllerHandler(listController.create));
router.patch('/lists/:id(\\d+)', controllerHandler(listController.update));
router.delete('/lists/:id(\\d+)', controllerHandler(listController.delete));

/** CARD */
router.get('/cards', controllerHandler(cardController.getAll));
router.get('/cards/:id(\\d+)', controllerHandler(cardController.getOne));
router.post('/cards', controllerHandler(cardController.create));
router.patch('/cards/:id(\\d+)', controllerHandler(cardController.update));
router.delete('/cards/:id(\\d+)', controllerHandler(cardController.delete));
router.get('/lists/:id(\\d+)/cards', controllerHandler(cardController.getCardsInList));

/** LABEL */
router.get('/labels', controllerHandler(labelController.getAll));
router.get('/labels/:id(\\d+)', controllerHandler(labelController.getOne));
router.post('/labels', controllerHandler(labelController.create));
router.patch('/labels/:id(\\d+)', controllerHandler(labelController.update));
router.delete('/labels/:id(\\d+)', controllerHandler(labelController.delete));
router.post('/cards/:card_id(\\d+)/labels', controllerHandler(labelController.addLabelToCard));
router.delete('/cards/:card_id(\\d+)/labels/:label_id(\\d+)', controllerHandler(labelController.removeLabelFromCard));

router.use(() => {
    throw new ApiError('Page not found', { statusCode: 404 });
});

router.use((err, _, response, next) => {
    errorHandler(err, response, next);
});

module.exports = router;
