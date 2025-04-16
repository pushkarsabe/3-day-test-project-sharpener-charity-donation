const SibApiV3Sdk = require('sib-api-v3-sdk');
require('dotenv').config();

const sendEmail = async (recipientEmail, amount, charityName, charityPhone, charityCategory, charityCity) => {
    try {
        console.log('inside sendEmail recipientEmail = ', recipientEmail);
        console.log("recipientEmail = ", recipientEmail);
        console.log('charityName :', charityName);
        console.log('charityPhone :', charityPhone);
        console.log('charityCategory :', charityCategory);
        console.log('charityCity :', charityCity);

        const apiKey = process.env.apiKey;

        if (!apiKey) {
            throw new Error('Sendinblue API key is not defined in environment variables');
        }

        const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
        SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = apiKey;

        const emailContent = `
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #2E8B57;">Donation Successful!</h2>
                <p>Dear Donor,</p>
                <p>Thank you for your generous donation of <strong>₹${amount}</strong> to <strong>${charityName}</strong>.</p>

                <h3> Charity Details:</h3>
                <ul>
                    <li><strong>Name:</strong> ${charityName}</li>
                    <li><strong>Phone:</strong> ${charityPhone}</li>
                    <li><strong>Category:</strong> ${charityCategory}</li>
                    <li><strong>City:</strong> ${charityCity}</li>
                </ul>

                <p>Your contribution will help this organization continue its mission and bring real change to the lives of many.</p>

                <p><strong>Status:</strong> <span style="color: green;">SUCCESSFUL</span></p>
                <p>If you have any questions or need a donation receipt, feel free to contact us.</p>

                <p>Warm regards,<br>
                <strong>The Charity Team</strong></p>
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
