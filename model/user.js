const Sequelize = require('sequelize');
const sequelize = require('../util/db');

const User = sequelize.define('signup', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    donations: {
        type: Sequelize.STRING
    },
    dob: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    gender: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    passportnumber: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    pannumber: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    isDeleleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    }
});

module.exports = User;