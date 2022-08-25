const express = require('express');

const controllerHandler = require('./helpers/controllerHandler');
const { errorHandler, ApiError } = require('./helpers/errorHandler');

const { mainController, cardController, labelController } = require('./controllers');

const router = express.Router();

/** factorized CRUD routes */
router.get('/:entity', controllerHandler(mainController.getAll));
router.get('/:entity/:id(\\d+)', controllerHandler(mainController.getOne));
router.post('/:entity', controllerHandler(mainController.create));
router.patch('/:entity/:id(\\d+)', controllerHandler(mainController.update));
router.delete('/:entity/:id(\\d+)', controllerHandler(mainController.delete));

/** CARD */
router.get('/lists/:id(\\d+)/cards', controllerHandler(cardController.getCardsInList));

/** LABEL */
router.post('/cards/:card_id(\\d+)/labels', controllerHandler(labelController.addLabelToCard));
router.delete('/cards/:card_id(\\d+)/labels/:label_id(\\d+)', controllerHandler(labelController.removeLabelFromCard));

router.use(() => {
    throw new ApiError('Page not found', { statusCode: 404 });
});

router.use((err, _, response, next) => {
    errorHandler(err, response, next);
});

module.exports = router;
