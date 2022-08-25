const debug = require('debug')('mainController');

const { ApiError } = require('../helpers/errorHandler');

const listController = require('./list');
const cardController = require('./card');
const labelController = require('./label');

const models = require('../models');

const mainController = {
    getModel: (entity) => {
        debug('getModel');
        let model = null;
        Object.entries(models).forEach(([key]) => {
            if (models[key].routeName === entity) {
                model = models[key];
            }
        });
        return model;
    },
    getAll: async (req, res) => {
        debug('getAll');
        const { entity } = req.params;
        const Model = mainController.getModel(entity);
        if (!Model) {
            throw new ApiError('Entity not found', { statusCode: 404 });
        }
        const data = await Model.findAll({
            include: {
                all: true,
                nested: true,
            },
            order: Model.orderDefault,
        });

        return res.json(data);
    },
    getOne: async (req, res) => {
        debug('getOne');
        const { entity, id } = req.params;
        const Model = mainController.getModel(entity);
        if (!Model) {
            throw new ApiError('Entity not found', { statusCode: 404 });
        }
        const data = await Model.findByPk(id, {
            include: {
                all: true,
                nested: true,
            },
            order: Model.orderDefault,
        });
        if (!data) {
            throw new ApiError('Item not found', { statusCode: 404 });
        }

        return res.json(data);
    },
    create: async (req, res) => {
        debug('create');
        const { entity } = req.params;
        const Model = mainController.getModel(entity);
        if (!Model) {
            throw new ApiError('Entity not found', { statusCode: 404 });
        }
        Model.requiredFields.forEach((field) => {
            if (!req.body[field]) {
                throw new ApiError(`${field} is required`, { statusCode: 400 });
            }
        });

        if (req.body.list_id) {
            const list = await models.List.findByPk(req.body.list_id);
            if (!list) {
                throw new ApiError('List not found', { statusCode: 404 });
            }
        }

        const newItem = await Model.create(req.body);

        return res.json(newItem);
    },
};

module.exports = {
    mainController, listController, cardController, labelController,
};
