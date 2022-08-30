const { Model, DataTypes } = require('sequelize');
const sequelizeInstance = require('../config/database');

class List extends Model {
    static routeName = 'lists';

    static orderDefault = [
        ['position', 'ASC'],
        ['cards', 'position', 'ASC'],
        ['cards', 'labels', 'title', 'ASC'],
    ];

    static requiredFields = ['title'];
}

List.init({
    title: DataTypes.TEXT,
    position: DataTypes.SMALLINT,
}, {
    sequelize: sequelizeInstance,
    tableName: 'list',
});

module.exports = List;
