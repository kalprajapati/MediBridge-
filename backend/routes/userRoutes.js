import express from 'express'
import { registerUser, loginUser, forgotPassword, verifyResetCode, resetPassword, getProfile, updateProfile, listDoctors, bookAppointment, listAppointments, cancelAppointment, paymentRazorpay, verifyRazorpay } from "../controllers/userController.js";
import authUser from '../middlewares/authUser.js';
import upload from '../middlewares/multer.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/verify-reset-code', verifyResetCode);
userRouter.post('/reset-password', resetPassword);
userRouter.get('/doctors', listDoctors);
userRouter.get('/get-profile',authUser, getProfile)
userRouter.post('/update-profile', upload.single('image'),authUser, updateProfile)
userRouter.post('/book-appointment', authUser, bookAppointment)
userRouter.get('/appointments', authUser, listAppointments)
userRouter.post('/cancel-appointment', authUser, cancelAppointment)
userRouter.post('/payment-razorpay', authUser, paymentRazorpay)
userRouter.post('/verify-razorpay', authUser, verifyRazorpay)

export default userRouter
 
