const debug = require('debug')('cardController');

const { ApiError } = require('../helpers/errorHandler');

const { Card, List } = require('../models');

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
    create: async (req, res) => {
        debug('create');
        if (!req.body.title) {
            throw new ApiError('title is required');
        }
        if (!req.body.list_id) {
            throw new ApiError('list_id is required');
        }
        const list = await List.findByPk(req.body.list_id);
        if (!list) {
            throw new ApiError('List not found', { statusCode: 404 });
        }
        const newCard = await Card.create({
            title: req.body.title,
            color: req.body.color,
            position: req.body.position,
            list_id: req.body.list_id,
        });

        return res.json(newCard);
    },
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
};

module.exports = cardController;
