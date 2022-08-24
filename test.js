const debug = require('debug')('test');

require('dotenv').config();

const List = require('./app/models/list');
const Card = require('./app/models/card');

const someTests = async () => {
    try {
        const lists = await List.findAll();
        debug(lists);
        const cards = await Card.findAll();
        debug(cards);
    } catch (error) {
        debug(error);
    }
};

someTests();
