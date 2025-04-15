const Order = require('../model/order');
const Razorpay = require('razorpay');
const sendEmail = require('../config/emailService');
require('dotenv').config();

exports.donateMoney = async (req, res, next) => {
    try {
        let { amount } = req.body;
        console.log('amount = ' + amount);

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid donation amount" });
        }

        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
        console.log('key_id = ' + rzp.key_id);
        console.log('key_secret = ' + rzp.key_secret);

        // Order creation
        const order = await rzp.orders.create({
            amount: amount,
            currency: 'INR'
        });

        if (!order) {
            return res.status(500).json({ message: 'Order creation failed' });
        }

        // Creating an order for the user
        const userOrder = await Order.create({
            orderid: order.id,
            status: 'PENDING',
            userId: req.user._id,
            amount: amount
        });
        console.log('userOrder = ' + userOrder);

        return res.status(201).json({
            order,
            userOrder,
            key_id: process.env.RAZORPAY_KEY_ID,
            message: 'Donation created successfully'
        });
    }
    catch (err) {
        console.log('Error in donateMoney: ', err);
        return res.status(500).json({ message: 'Something went wrong' });
    }
}//donateMoney

exports.updateTransactionStatus = async (req, res, next) => {
    try {
        const { payment_id, order_id, amount } = req.body;
        console.log('updateTransactionstatus payment_id :', payment_id, "order_id :", order_id, 'amount = ', amount);

        // Find the order based on the order ID
        const order = await Order.findOne({ orderid: order_id });
        console.log('order:', order);

        // If the order is not found, return error
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Find the user
        if (!req.user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Update the order status to 'SUCCESSFUL' and save payment ID
        order.paymentid = payment_id;
        order.status = 'SUCCESSFUL';
        order.amount = amount.toString();
        await order.save();

        // Donation amount 
        const donationAmount = amount || req.body.amount || 0;
        console.log('donationAmount :', donationAmount);
        // Get the current donations of the user 
        const currentDonations = parseFloat(req.user.donations) || 0;
        console.log('currentDonations :', currentDonations);
        //update the donation amount in user table
        req.user.donations = (currentDonations + donationAmount).toString();
        await req.user.save();

        // After successful updates, retrieve the updated order and user
        const orderAfterUpdate = await Order.find({ orderid: order_id });
        console.log('orderAfterUpdate:', orderAfterUpdate);

        //send email
        let email = req.user.email;
        console.log('email :', email);
        console.log('amount :', amount);
        await sendEmail(email, amount);

        return res.status(201).json({
            orderAfterUpdate,
            message: 'Donation updated successfully'
        });

    } catch (err) {
        console.log('updateTransactionstatusF err = ' + err);
        return res.status(500).json({ success: false, message: 'Transaction Failed' });
    }
};

exports.getAllOrdersData = async (req, res) => {
    try {
        console.log("getAllOrdersData");
        let userid = req.user._id;
        console.log('userid = ' + userid);

        let allOrderData = await Order.find({
            userId: userid,
            status: 'SUCCESSFUL'
        }).populate('charityId', 'name');

        console.log('allOrderData = ' + allOrderData);

        res.status(200).json({ message: 'success', allOrderData: allOrderData });
    }
    catch (err) {
        console.error('getAllOrdersData error:', err);
        res.status(500).json({ message: 'Failed to get all orders data' });
    }
}