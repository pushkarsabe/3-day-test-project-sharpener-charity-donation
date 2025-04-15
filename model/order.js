const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    paymentid: {
        type: String,
        default: null
    },
    orderid: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'PENDING'
    },
    amount: {
        type: String,
        required: false
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    charityId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Charity'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);