const listController = require('./list');
const cardController = require('./card');

const mainController = {
    test: (req, res) => {
        res.send('test ok');
    },
};

module.exports = { mainController, listController, cardController };
