const debug = require('debug')('cardController');

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
};

module.exports = cardController;
