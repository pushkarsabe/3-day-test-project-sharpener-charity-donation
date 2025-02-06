const Order = require('../model/order');
const Razorpay = require('razorpay');
require('dotenv').config();
const SibApiV3Sdk = require('sib-api-v3-sdk');

exports.sendEmail = async (recipientEmail, amount, transactionStatus) => {
    try {
        const apiKey = process.env.apiKey;
        const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
        SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = apiKey;

        const emailContent = `
        <html>
            <body>
                <h1>Donation Success</h1>
                <p>Thank you for your generous donation of ₹${amount}.</p>
                <p>Transaction Status: ${transactionStatus}</p>
                <p>Your support is greatly appreciated!</p>
            </body>
        </html>
         `;
        const emailData = {
            sender: {
                name: 'Charity Team',
                email: 'sabepushkar@gmail.com',
            },
            to: [
                {
                    email: 'pushkarsabe@gmail.com',// Donor's email = recipientEmail
                },
            ],
            subject: 'Thank You for Your Donation!',
            htmlContent: emailContent,
        };

        await apiInstance.sendTransacEmail(emailData);
        console.log('Email sent successfully!');
    }
    catch (err) {
        console.error('Error sending email:', error);
        throw new Error('Error sending email');
    }
};//sendEmail

exports.donateMoney = async (req, res, next) => {
    try {
        const { amount } = req.body;
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
        const userOrder = await req.user.createOrder({ orderid: order.id, status: 'PENDING' });

        return res.status(201).json({ order, key_id: rzp.key_id, userOrder, message: 'Order created successfully' });
    }
    catch (err) {
        console.log('Error in donateMoney: ', err);
    }
}//donateMoney

exports.updateTransactionstatus = async (req, res, next) => {
    try {
        const { payment_id, order_id } = req.body;

        // Find the order based on the order ID
        const orderBeforeUpdate = await Order.findOne({ where: { orderid: order_id } });
        console.log('orderBeforeUpdate:', orderBeforeUpdate.toJSON());

        // If the order is not found, return error
        if (!orderBeforeUpdate) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Find the user
        if (!req.user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Update the order status to 'SUCCESSFUL' and save payment ID
        const promise1 = orderBeforeUpdate.update({ paymentid: payment_id, status: 'SUCCESSFUL' });

        // Donation amount 
        const donationAmount = orderBeforeUpdate.amount;

        // Get the current donations of the user 
        const currentDonations = parseFloat(req.user.donations) || 0;

        // Update the donations field by adding the donation amount
        const promise2 = req.user.update({
            donations: (currentDonations + donationAmount).toString()  // Convert the result back to string
        });

        // Wait for both updates to be completed
        await Promise.all([promise1, promise2]);

        // After successful updates, retrieve the updated order and user
        const orderAfterUpdate = await Order.findOne({ where: { orderid: order_id } });
        console.log('orderAfterUpdate:', orderAfterUpdate.toJSON());

        const userAfterUpdate = await req.user.reload();
        console.log('userAfterUpdate:', userAfterUpdate.toJSON());

        //send email to the donor
        const donorEmail = req.user.email;
        const transactionStatus = 'Successful';
        await exports.sendEmail(donorEmail, donationAmount, transactionStatus);

        // Return success response
        return res.status(202).json({ success: true, message: 'Transaction Successful' });

    } catch (err) {
        console.log('updateTransactionstatusF err = ' + err);
        return res.status(500).json({ success: false, message: 'Transaction Failed' });
    }
};//updateTransactionstatus