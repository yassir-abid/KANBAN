const debug = require('debug')('listController');

const { ApiError } = require('../helpers/errorHandler');

const { List } = require('../models');

const listController = {
    getAll: async (req, res) => {
        debug('getAll');
        const lists = await List.findAll();
        return res.json(lists);
    },
    getOne: async (req, res) => {
        debug('getOne');
        const { id } = req.params;
        const list = await List.findByPk(id);
        if (!list) {
            throw new ApiError('List not found', { statusCode: 404 });
        }
        return res.json(list);
    },
    create: async (req, res) => {
        debug('create');
        const newList = await List.create({
            title: req.body.title,
            position: req.body.position,
        });
        return res.json(newList);
    },
    update: async (req, res) => {
        debug('update');
        const { id } = req.params;
        const list = await List.findByPk(id);
        if (!list) {
            throw new ApiError('List not found', { statusCode: 404 });
        }
        if (req.body.title) {
            list.title = req.body.title;
        }
        if (req.body.position) {
            list.position = req.body.position;
        }
        const updatedList = await list.save();
        return res.json(updatedList);
    },
};

module.exports = listController;
