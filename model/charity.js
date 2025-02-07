const Sequelize = require('sequelize');
const sequelize = require('../util/db');
const { UUID, UUIDV4 } = Sequelize;

const Charity = sequelize.define('charity', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    uuid: {
        type: UUID, //setup as registration id 
        defaultValue: UUIDV4,
        allowNull: false,
        unique: true
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
    category: {
        type: Sequelize.STRING,
        allowNull: false,
    },


    beneficiary: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    beneficiaryName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    relation: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    beneficiaryLocationState: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    beneficiaryLocationCity: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    beneficiaryMobileNumber: {
        type: Sequelize.STRING,
        allowNull: false,
    },


    funds: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    hospitalName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    hospitalLocationState: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    hospitalLocationCity: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    medicalCondition: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    hospitalisationStatus: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    date: {
        type: Sequelize.STRING,
        allowNull: false,
    },


    fundraiserName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    storyForFundraising: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    isApproved: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },

});

module.exports = Charity;