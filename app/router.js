const express = require('express');

const controllerHandler = require('./helpers/controllerHandler');
const { errorHandler, ApiError } = require('./helpers/errorHandler');
const userMiddleware = require('./middlewares/user');

const {
    mainController, cardController, labelController, userController,
} = require('./controllers');

const router = express.Router();

/** USER */
router.post('/signup', controllerHandler(userController.subscribe));
router.post('/login', controllerHandler(userController.login));
router.get('/logout', controllerHandler(userController.logout));

/** factorized CRUD routes */
router.get('/:entity', userMiddleware, controllerHandler(mainController.getAll));
router.get('/:entity/:id(\\d+)', userMiddleware, controllerHandler(mainController.getOne));
router.post('/:entity', userMiddleware, controllerHandler(mainController.create));
router.patch('/:entity/:id(\\d+)', userMiddleware, controllerHandler(mainController.update));
router.delete('/:entity/:id(\\d+)', userMiddleware, controllerHandler(mainController.delete));

/** CARD */
router.get('/lists/:id(\\d+)/cards', userMiddleware, controllerHandler(cardController.getCardsInList));

/** LABEL */
router.post('/cards/:card_id(\\d+)/labels', userMiddleware, controllerHandler(labelController.addLabelToCard));
router.delete('/cards/:card_id(\\d+)/labels/:label_id(\\d+)', userMiddleware, controllerHandler(labelController.removeLabelFromCard));

router.use(() => {
    throw new ApiError('Page not found', { statusCode: 404 });
});

router.use((err, _, response, next) => {
    errorHandler(err, response, next);
});

module.exports = router;
