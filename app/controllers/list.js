const debug = require('debug')('listController');

const { List } = require('../models');

const listController = {
    getAll: async (req, res) => {
        debug('getAll');
        const lists = await List.findAll();
        return res.json(lists);
    },
};

module.exports = listController;
