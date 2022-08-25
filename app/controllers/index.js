const listController = require('./list');
const cardController = require('./card');
const labelController = require('./label');

const mainController = {
    test: (req, res) => {
        res.send('test ok');
    },
};

module.exports = {
    mainController, listController, cardController, labelController,
};
