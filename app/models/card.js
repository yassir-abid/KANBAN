const { Model, DataTypes } = require('sequelize');
const sequelizeInstance = require('../config/database');

class Card extends Model {
    static routeName = 'cards';

    static orderDefault = [
        ['position', 'ASC'],
    ];

    static requiredFields = ['title', 'list_id'];
}

Card.init({
    title: DataTypes.TEXT,
    position: DataTypes.SMALLINT,
    color: DataTypes.TEXT,
}, {
    sequelize: sequelizeInstance,
    tableName: 'card',
});

module.exports = Card;
