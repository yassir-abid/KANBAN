const debug = require('debug')('test');

require('dotenv').config();

const List = require('./app/models/list');
const Card = require('./app/models/card');
const Label = require('./app/models/label');

const someTests = async () => {
    try {
        const lists = await List.findAll();
        debug(lists);
        const cards = await Card.findAll();
        debug(cards);
        const labels = await Label.findAll();
        debug(labels);
    } catch (error) {
        debug(error);
    }
};

someTests();
