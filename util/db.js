const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.MYSQLSCHEMA, process.env.MYSQLUSERNAME, process.env.MYSQLUSERNAME, {
    dialect: process.env.MYSQLDIALECT,
    host: process.env.HOST
});

module.exports = sequelize;
