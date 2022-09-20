const { Model, DataTypes } = require('sequelize');
const sequelizeInstance = require('../config/database');

class User extends Model {
    get fullname() {
        return `${this.firstname} ${this.lastname}`;
    }
}

User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
}, {
    sequelize: sequelizeInstance,
    tableName: 'user',
});

module.exports = User;
