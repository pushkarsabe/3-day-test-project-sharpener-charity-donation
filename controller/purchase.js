const Order = require('../model/order');
const Razorpay = require('razorpay');
const sendEmail = require('../config/emailService');
const cloudinary = require('../config/cloudinary');
const PDFDocument = require('pdfkit');
require('dotenv').config();

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

        return res.status(201).json({ order, userOrder, message: 'Donation created successfully' });
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

        // Create the PDF receipt
        const pdfDoc = new PDFDocument();
        let pdfBuffer = [];
        pdfDoc.on('data', chunk => pdfBuffer.push(chunk));
        pdfDoc.on('end', async () => {
            const pdfData = Buffer.concat(pdfBuffer);

            // Upload the PDF to Cloudinary
            try {
                const uploadResponse = await cloudinary.uploader.upload_stream(
                    { resource_type: 'auto', public_id: `receipt_${order_id}` },
                    async (error, result) => {
                        if (error) {
                            console.log("Error uploading to Cloudinary: ", error);
                            return res.status(500).json({ success: false, message: 'Failed to upload PDF to Cloudinary' });
                        }

                        // Send the download link to the user in the email
                        const pdfDownloadLink = result.secure_url;
                        const donorEmail = req.user.email;
                        const transactionStatus = 'Successful';

                        // Send email with the PDF link
                        await sendEmail(donorEmail, donationAmount, transactionStatus, pdfDownloadLink);

                        return res.status(202).json({
                            success: true,
                            message: 'Transaction Successful',
                            receiptUrl: pdfDownloadLink
                        });
                    }
                );

                pdfDoc.pipe(uploadResponse);
                pdfDoc.text(`Donation Receipt for Order ID: ${order_id}`);
                pdfDoc.text(`Amount Donated: ₹${donationAmount}`);
                pdfDoc.text(`Transaction ID: ${payment_id}`);
                pdfDoc.text(`Transaction Status: SUCCESSFUL`);
                pdfDoc.text(`Donor Name: ${req.user.name}`);
                pdfDoc.text(`Thank you for your generous donation!`);
                pdfDoc.end();
            } catch (err) {
                console.error('Error during PDF creation or Cloudinary upload:', err);
                return res.status(500).json({ success: false, message: 'Failed to create and upload PDF' });
            }
        });
    } catch (err) {
        console.log('updateTransactionstatusF err = ' + err);
        return res.status(500).json({ success: false, message: 'Transaction Failed' });
    }
};