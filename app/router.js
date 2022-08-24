const express = require('express');
const mainController = require('./controllers');

const router = express.Router();

router.get('/test', mainController.test);

module.exports = router;
