const debug = require('debug')('test');

require('dotenv').config();

const List = require('./app/models/list');

const someTests = async () => {
    try {
        const lists = await List.findAll();
        debug(lists);
    } catch (error) {
        debug(error);
    }
};

someTests();
