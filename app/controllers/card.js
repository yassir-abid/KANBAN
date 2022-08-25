const debug = require('debug')('cardController');

const { ApiError } = require('../helpers/errorHandler');

const { Card, List } = require('../models');

const cardController = {
    getCardsInList: async (req, res) => {
        debug('getCardsInList');
        const { id } = req.params;
        const list = await List.findByPk(id);
        if (!list) {
            throw new ApiError('List not found', { statusCode: 404 });
        }
        const cards = await Card.findAll({
            where: {
                list_id: id,
            },
            include: 'labels',
        });
        return res.json(cards);
    },
};

module.exports = cardController;
