const { Model, DataTypes } = require('sequelize');
const sequelizeInstance = require('../config/database');

class Label extends Model { }

Label.init({
    title: DataTypes.TEXT,
    color: DataTypes.TEXT,
}, {
    sequelize: sequelizeInstance,
    tableName: 'label',
});

module.exports = Label;
