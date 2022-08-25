const debug = require('debug')('labelController');

const { Label } = require('../models');

const labelController = {
    getAll: async (req, res) => {
        debug('getAll');
        const labels = await Label.findAll();
        return res.json(labels);
    },
};

module.exports = labelController;
