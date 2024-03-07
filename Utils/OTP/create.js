const {createOtp} = require('../Database/create');
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');



async function sendOTP(email, otp) {
    try {
        // Create a transporter object using SMTP transport
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'importpandasasnp22@gmail.com', // Your Gmail email address
                pass: 'alal llwq mdxx nxlr' // Your Gmail password
            }
        });

        // Define email options
        let mailOptions = {
            from: 'importpandasasnp22@gmail.com', // Sender address
            to: email, // List of recipients
            subject: 'Your OTP', // Subject line
            text: `Your OTP is: ${otp}` // Plain text body
        };

        // Send mail with defined transport object
        let info = await transporter.sendMail(mailOptions);

        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.error("Error occurred while sending email:", error);
    }
}

async function createOtpWithMail(email) {
    try {
        const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
        const otpData = await createOtp(email, otp);
        await sendOTP(email, otp);
        return otpData;
    } catch (error) {
        console.error("Error occurred while creating OTP:", error);
    }
}

module.exports = createOtpWithMail;