const debug = require('debug')('test');

require('dotenv').config();

// eslint-disable-next-line object-curly-newline
const { Card, List, Label, User } = require('./app/models');

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
        const user = await User.findByPk(1, {
            include: ['lists'],
        });
        debug(user.lists[0]);
    } catch (error) {
        debug(error);
    }
};

someTests();
