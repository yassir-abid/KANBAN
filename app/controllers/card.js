const debug = require('debug')('cardController');

const { ApiError } = require('../helpers/errorHandler');

const { Card } = require('../models');

const cardController = {
    getAll: async (req, res) => {
        debug('getAll');
        const cards = await Card.findAll({
            include: 'labels',
            order: [
                ['position', 'ASC'],
            ],
        });
        return res.json(cards);
    },
    getOne: async (req, res) => {
        debug('getOne');
        const { id } = req.params;
        const card = await Card.findByPk(id, {
            include: 'labels',
            order: [
                ['position', 'ASC'],
            ],
        });
        if (!card) {
            throw new ApiError('Card not found', { statusCode: 404 });
        }
        return res.json(card);
    },
};

module.exports = cardController;
