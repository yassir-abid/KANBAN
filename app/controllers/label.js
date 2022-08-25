const debug = require('debug')('labelController');

const { ApiError } = require('../helpers/errorHandler');

const { Label } = require('../models');

const labelController = {
    getAll: async (req, res) => {
        debug('getAll');
        const labels = await Label.findAll();
        return res.json(labels);
    },
    getOne: async (req, res) => {
        debug('getOne');
        const { id } = req.params;
        const label = await Label.findByPk(id);
        if (!label) {
            throw new ApiError('Label not found', { statusCode: 404 });
        }
        return res.json(label);
    },
    create: async (req, res) => {
        debug('create');
        if (!req.body.title) {
            throw new ApiError('title is required', { statusCode: 400 });
        }
        const newLabel = await Label.create({
            title: req.body.title,
            color: req.body.color,
        });
        return res.json(newLabel);
    },
    update: async (req, res) => {
        debug('update');
        const { id } = req.params;
        const label = await Label.findByPk(id);
        if (!label) {
            throw new ApiError('Label not found', { statusCode: 404 });
        }
        // if (req.body.title) {
        //     label.title = req.body.title;
        // }
        // if (req.body.color) {
        //     label.color = req.body.color;
        // }
        Object.entries(req.body).forEach(([key, value]) => {
            if (['title', 'color'].includes(key)) {
                debug(key);
                label[key] = value;
            }
        });
        const updatedLabel = await label.save();
        return res.json(updatedLabel);
    },
};

module.exports = labelController;