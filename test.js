const debug = require('debug')('test');

require('dotenv').config();

const { Card, List, Label } = require('./app/models');

const someTests = async () => {
    try {
        const lists = await List.findAll();
        debug(lists);
        const cards = await Card.findAll();
        debug(cards);
        const labels = await Label.findAll();
        debug(labels);
        const cardsAndLabels = await Card.findAll({
            include: ['list', 'labels'],
        });
        debug(cardsAndLabels);
        debug(cardsAndLabels[0].labels);
    } catch (error) {
        debug(error);
    }
};

someTests();
