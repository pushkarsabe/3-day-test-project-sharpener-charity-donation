const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const charitySchema = new mongoose.Schema({
    uuid: {
        type: String,
        default: uuidv4,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    beneficiary: {
        type: String,
        required: true
    },
    beneficiaryName: {
        type: String,
        required: true
    },
    relation: {
        type: String,
        required: true
    },
    beneficiaryLocationState: {
        type: String,
        required: true
    },
    beneficiaryLocationCity: {
        type: String,
        required: true
    },
    beneficiaryMobileNumber: {
        type: String,
        required: true
    },
    funds: {
        type: String,
        required: true
    },
    hospitalName: {
        type: String,
        required: true
    },
    hospitalLocationState: {
        type: String,
        required: true
    },
    hospitalLocationCity: {
        type: String,
        required: true
    },
    medicalCondition: {
        type: String,
        required: true
    },
    hospitalisationStatus: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    fundraiserName: {
        type: String,
        required: true
    },
    storyForFundraising: {
        type: String,
        required: true
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Charity', charitySchema);
