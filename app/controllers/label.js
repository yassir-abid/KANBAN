const debug = require('debug')('labelController');

const { ApiError } = require('../helpers/errorHandler');

const { Label, Card } = require('../models');

const labelController = {
    addLabelToCard: async (req, res) => {
        debug('addLabelToCard');
        const cardId = req.params.card_id;
        const labelId = req.body.label_id;
        const card = await Card.findByPk(cardId, {
            include: 'labels',
        });
        if (!card) {
            throw new ApiError('Card not found', { statusCode: 404 });
        }
        const label = await Label.findByPk(labelId);
        if (!label) {
            throw new ApiError('Label not found', { statusCode: 404 });
        }

        await card.addLabel(label);
        await card.reload();

        return res.json(card);
    },
    removeLabelFromCard: async (req, res) => {
        debug('removeLabelFromCard');
        const { card_id: cardId, label_id: labelId } = req.params;

        const card = await Card.findByPk(cardId, {
            include: 'labels',
        });
        if (!card) {
            throw new ApiError('Card not found', { statusCode: 404 });
        }

        const label = await Label.findByPk(labelId);
        if (!label) {
            throw new ApiError('Label not found', { statusCode: 404 });
        }

        await card.removeLabel(label);
        await card.reload();

        return res.json(card);
    },
};

module.exports = labelController;
