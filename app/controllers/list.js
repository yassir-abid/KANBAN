const debug = require('debug')('listController');

const { ApiError } = require('../helpers/errorHandler');

const { List } = require('../models');

const listController = {
    delete: async (req, res) => {
        debug('delete');
        const { id } = req.params;
        const list = await List.findByPk(id);
        if (!list) {
            throw new ApiError('List not found', { statusCode: 404 });
        }
        await list.destroy();
        return res.json('List deleted');
    },
};

module.exports = listController;
