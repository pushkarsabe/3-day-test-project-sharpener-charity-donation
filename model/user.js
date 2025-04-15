const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true },
    donations: String,
    dob: String,
    gender: String,
    passportnumber: String,
    pannumber: String,
    isDeleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', userSchema);
