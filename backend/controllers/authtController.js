const Profile = require('../models/Profile');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config();

const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        await Profile.findOneAndUpdate(
            { email },
            { otp, otpExpires },
            { upsert: true, new: true }
        );

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'rawnuk13@gmail.com',
                pass: 'skzsivdmozmosrya', // Use environment variable
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL, // Fixed 'from' field
            to: email,
            subject: 'Your OTP Code',
            html: `
  <div style="background-color: #E3F2FD; padding: 20px; font-family: Arial, sans-serif; border-radius: 8px;">
    <h2 style="color: #1565C0;">Welcome to Freelancers</h2>
    <p>Dear User,</p>
    <p>We received a request to verify your account. Please use the OTP code below to proceed:</p>
    <h3 style="background-color: #BBDEFB; padding: 10px; display: inline-block; border-radius: 5px;">${otp}</h3>
    <p>This code is valid for 10 minutes. If you did not request this, please ignore this email.</p>
    <p>If you have any issues, please contact our support team at: <strong>rawnuk13@gmail.com</strong></p>
    <p>Best regards,<br><strong>Freelancers Team</strong></p>
  </div>
`

        });

        res.json({ message: 'OTP sent' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ message: 'Failed to send OTP' });
    }
};

const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    console.log(`Verifying OTP for email: ${email}, OTP: ${otp}`);

    const user = await Profile.findOne({ email });
    console.log('User found:', user);

    if (!user) {
        console.log('User not found');
        return res.status(400).json({ message: 'User not found' });
    }

    console.log(`Stored OTP: ${user.otp}, Received OTP: ${otp}`);
    console.log(`OTP Expiry Time: ${user.otpExpires}, Current Time: ${new Date()}`);

    if (user.otp !== otp || user.otpExpires < new Date()) {
        console.log('Invalid or expired OTP');
        return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    console.log('OTP verified successfully');
    res.json({ message: 'OTP verified' });
};


module.exports = { sendOtp, verifyOtp };
