const listController = require('./list');

const mainController = {
    test: (req, res) => {
        res.send('test ok');
    },
};

module.exports = { mainController, listController };
