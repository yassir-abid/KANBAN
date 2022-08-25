const debug = require('debug')('cardController');

const { ApiError } = require('../helpers/errorHandler');

const { Card, List } = require('../models');

const cardController = {
    update: async (req, res) => {
        debug('update');
        const { id } = req.params;
        const card = await Card.findByPk(id);
        if (!card) {
            throw new ApiError('Card not found', { statusCode: 404 });
        }
        // if (req.body.title) {
        //     card.title = req.body.title;
        // }
        // if (req.body.color) {
        //     card.color = req.body.color;
        // }
        // if (req.body.position) {
        //     card.position = req.body.position;
        // }
        // if (req.body.list_id) {
        //     card.list_id = req.body.list_id;
        // }
        Object.entries(req.body).forEach(([key, value]) => {
            if (['title', 'position', 'color', 'list_id'].includes(key)) {
                debug(key);
                card[key] = value;
            }
        });
        const updatedCard = await card.save();
        return res.json(updatedCard);
    },
    delete: async (req, res) => {
        debug('delete');
        const { id } = req.params;
        const card = await Card.findByPk(id);
        if (!card) {
            throw new ApiError('Card not found', { statusCode: 404 });
        }
        await card.destroy();
        return res.json('Card deleted');
    },
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
