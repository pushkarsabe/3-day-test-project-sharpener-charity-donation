const SibApiV3Sdk = require('sib-api-v3-sdk');
require('dotenv').config();

const sendEmail = async (recipientEmail, amount, transactionStatus, pdfDownloadLink) => {
    try {
        console.log('inside sendEmail recipientEmail = ', recipientEmail);
        console.log('pdfDownloadLink = ', pdfDownloadLink);
        const apiKey = process.env.apiKey;
        const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
        SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = apiKey;

        const emailContent = `
        <html>
            <body>
                <h1>Donation Success</h1>
                <p>Thank you for your generous donation of ₹${amount}.</p>
                <p>Transaction Status: ${transactionStatus}</p>
                <p>Click below to download your receipt:</p>
                <a href="${pdfDownloadLink}" target="_blank">Download Receipt</a>
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
                    email: recipientEmail, // Donor's email = recipientEmail
                },
            ],
            subject: 'Thank You for Your Donation!',
            htmlContent: emailContent,
        };

        await apiInstance.sendTransacEmail(emailData);
        console.log('Email sent successfully!');
    }
    catch (err) {
        console.error('Error sending email:', err);
        throw new Error('Error sending email');
    }
};

module.exports = sendEmail;
