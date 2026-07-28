import express from 'express';
import { getMe, googleAuth, login, logout, register, resetPassword, sendOtp, verifyOtp } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);
router.post('/google-auth', googleAuth);
router.get('/me', protect, getMe);

export default router;  