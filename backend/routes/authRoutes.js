const express = require('express');
const { signup, login } = require('../controllers/authController');
const { sendOtp, verifyOtp } = require('../controllers/authtController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

module.exports = router;
