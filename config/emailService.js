const SibApiV3Sdk = require('sib-api-v3-sdk');
require('dotenv').config();

const sendEmail = async (recipientEmail, amount) => {
    try {
        console.log('inside sendEmail recipientEmail = ', recipientEmail);
        const apiKey = process.env.apiKey;

        if (!apiKey) {
            throw new Error('Sendinblue API key is not defined in environment variables');
        }

        const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
        SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = apiKey;
        const emailContent = `
            <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2>Donation Successful</h2>
                    <p>Dear Donor,</p>
                    <p>Thank you for your generous donation of <strong>₹${amount}</strong>.</p>
                    <p><strong>Transaction Status:</strong> <span style="color: green;">SUCCESSFUL</span></p>
                    <p>Your support helps us continue our mission and make a positive impact.</p>
                    <p>Warm regards,<br>The Charity Team</p>
                </body>
            </html>
        `;

        const emailData = {
            sender: {
                name: 'Charity Team',
                email: 'pushkarsabe@gmail.com',
            },
            to: [
                {
                    email: 'sabepushkar@gmail.com',
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
