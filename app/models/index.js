const List = require('./list');
const Card = require('./card');
const Label = require('./label');

Card.belongsTo(List, {
    as: 'list',
    foreignKey: 'list_id',
});

List.hasMany(Card, {
    as: 'cards',
    foreignKey: 'list_id',
});

Card.belongsToMany(Label, {
    as: 'labels',
    through: 'card_has_label',
    foreignKey: 'card_id',
    otherKey: 'label_id',
    updatedAt: false,
});

Label.belongsToMany(Card, {
    as: 'cards',
    through: 'card_has_label',
    foreignKey: 'label_id',
    otherKey: 'card_id',
    updatedAt: false,
});

module.exports = {
    Card,
    List,
    Label,
};
