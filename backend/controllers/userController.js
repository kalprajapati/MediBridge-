import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'
import sendPasswordResetEmail from '../config/email.js'
import createRazorpayInstance from '../config/razorpay.js'
import crypto from 'crypto'

// Shared constants
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/
const otpExpiryMinutes = 10
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const findUserByEmail = (email) => userModel.findOne({ email: new RegExp(`^${escapeRegExp(email)}$`, 'i') })

// ================= REGISTER USER =================
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.json({ success: false, message: "fill all the fields" })
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        const userExists = await userModel.findOne({ email })
        if (userExists) {
            return res.json({ success: false, message: "User already exists with this email" })
        }

        if (!passwordRegex.test(password)) {
            return res.json({
                success: false,
                message: "Password must contain uppercase, lowercase, number and special character"
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPass = await bcrypt.hash(password, salt)

        const newUser = new userModel({ name, email, password: hashedPass })
        const user = await newUser.save()

        // FIX: Added expiresIn so tokens don't last forever
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
        res.json({ success: true, token })

    } catch (err) {
        console.error('registerUser error:', err.message)
        res.json({ success: false, message: "Error in registering user" })
    }
}

// ================= LOGIN USER =================
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "User does not exist" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            // FIX: Added expiresIn so tokens don't last forever
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
            res.json({ success: true, message: "Login successful!", token })
        } else {
            res.json({ success: false, message: "Invalid credentials!" })
        }

    } catch (err) {
        console.error('loginUser error:', err.message)
        res.json({ success: false, message: err.message })
    }
}

// ================= GET PROFILE =================
const getProfile = async (req, res) => {
    try {
        const userId = req.userId
        const userData = await userModel.findById(userId).select('-password')
        res.status(200).json({ success: true, userData })
    } catch (err) {
        console.error('getProfile error:', err.message)
        res.status(404).json({ success: false, message: err.message })
    }
}

// ================= UPDATE PROFILE =================
const updateProfile = async (req, res) => {
    try {
        const userId = req.userId
        const { name, phone, address, dob, gender } = req.body
        const imgFile = req.file

        if (!name || !gender || !phone || !dob) {
            return res.json({ success: false, message: "Fill all fields" })
        }

        // FIX: Safe JSON.parse with try-catch
        let parsedAddress = {}
        try {
            parsedAddress = address ? JSON.parse(address) : {}
        } catch {
            return res.json({ success: false, message: "Invalid address format" })
        }

        await userModel.findByIdAndUpdate(userId, { name, phone, address: parsedAddress, dob, gender })

        if (imgFile) {
            const imageUpload = await cloudinary.uploader.upload(imgFile.path, { resource_type: 'image' })
            const imgUrl = imageUpload.secure_url
            await userModel.findByIdAndUpdate(userId, { image: imgUrl })
        }

        res.json({ success: true, message: 'Profile updated' })

    } catch (err) {
        console.error('updateProfile error:', err.message)
        res.status(500).json({ success: false, message: err.message })
    }
}

// ================= LIST DOCTORS =================
const listDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select('-password').sort({ date: -1 })
        res.json({ success: true, doctors })
    } catch (err) {
        console.error('listDoctors error:', err.message)
        res.json({ success: false, message: "Error fetching doctors" })
    }
}

// ================= FORGOT PASSWORD =================
const forgotPassword = async (req, res) => {
    try {
        const email = req.body?.email?.trim().toLowerCase()

        if (!email) {
            return res.json({ success: false, message: "Email is required" })
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        const user = await findUserByEmail(email)

        if (!user) {
            return res.json({ success: false, message: "No account found with this email" })
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        const hashedOtp = await bcrypt.hash(otp, 10)

        user.resetPasswordOtp = hashedOtp
        user.resetPasswordOtpExpiresAt = new Date(Date.now() + otpExpiryMinutes * 60 * 1000)
        user.resetPasswordOtpVerified = false
        await user.save()

        await sendPasswordResetEmail(user.email, otp)

        res.json({ success: true, message: "Reset code sent to your registered email" })
    } catch (err) {
        console.error('forgotPassword error:', err.message)
        res.json({
            success: false,
            message: err.message === 'Email service is not configured'
                ? "Email service is not configured"
                : "Error sending reset code"
        })
    }
}

// ================= VERIFY RESET CODE =================
const verifyResetCode = async (req, res) => {
    try {
        const email = req.body?.email?.trim().toLowerCase()
        const otp = req.body?.otp?.trim()

        if (!email || !otp) {
            return res.json({ success: false, message: "Email and reset code are required" })
        }

        if (!/^\d{6}$/.test(otp)) {
            return res.json({ success: false, message: "Reset code must be 6 digits" })
        }

        const user = await findUserByEmail(email)

        if (!user || !user.resetPasswordOtp || !user.resetPasswordOtpExpiresAt) {
            return res.json({ success: false, message: "Invalid or expired reset code" })
        }

        if (user.resetPasswordOtpExpiresAt < new Date()) {
            return res.json({ success: false, message: "Reset code has expired" })
        }

        const isMatch = await bcrypt.compare(otp, user.resetPasswordOtp)

        if (!isMatch) {
            return res.json({ success: false, message: "Invalid reset code" })
        }

        user.resetPasswordOtpVerified = true
        await user.save()

        res.json({ success: true, message: "Code verified. You can set a new password" })
    } catch (err) {
        console.error('verifyResetCode error:', err.message)
        res.json({ success: false, message: "Error verifying reset code" })
    }
}

// ================= RESET PASSWORD =================
const resetPassword = async (req, res) => {
    try {
        const email = req.body?.email?.trim().toLowerCase()
        const otp = req.body?.otp?.trim()
        const { password } = req.body

        if (!email || !otp || !password) {
            return res.json({ success: false, message: "Email, reset code and new password are required" })
        }

        if (!passwordRegex.test(password)) {
            return res.json({
                success: false,
                message: "Password must contain uppercase, lowercase, number and special character"
            })
        }

        const user = await findUserByEmail(email)

        if (!user || !user.resetPasswordOtp || !user.resetPasswordOtpExpiresAt) {
            return res.json({ success: false, message: "Invalid or expired reset code" })
        }

        if (!user.resetPasswordOtpVerified || user.resetPasswordOtpExpiresAt < new Date()) {
            return res.json({ success: false, message: "Please verify a valid reset code first" })
        }

        const isMatch = await bcrypt.compare(otp, user.resetPasswordOtp)

        if (!isMatch) {
            return res.json({ success: false, message: "Invalid reset code" })
        }

        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(password, salt)
        user.resetPasswordOtp = ''
        user.resetPasswordOtpExpiresAt = null
        user.resetPasswordOtpVerified = false
        await user.save()

        res.json({ success: true, message: "Password changed successfully" })
    } catch (err) {
        console.error('resetPassword error:', err.message)
        res.json({ success: false, message: "Error resetting password" })
    }
}

// ================= BOOK APPOINTMENT =================
const bookAppointment = async (req, res) => {
    try {
        const userId = req.userId
        const { docId, slotDate, slotTime } = req.body

        if (!docId || !slotDate || !slotTime) {
            return res.json({ success: false, message: "Appointment date and time are required" })
        }

        const docData = await doctorModel.findById(docId).select('-password')

        if (!docData) {
            return res.json({ success: false, message: "Doctor not found" })
        }

        if (!docData.available) {
            return res.json({ success: false, message: "Doctor is not available" })
        }

        const slotsBooked = docData.slots_booked || {}

        if (slotsBooked[slotDate]?.includes(slotTime)) {
            return res.json({ success: false, message: "Slot already booked" })
        }

        const userData = await userModel.findById(userId).select('-password')

        if (!userData) {
            return res.json({ success: false, message: "User not found" })
        }

        slotsBooked[slotDate] = slotsBooked[slotDate] || []
        slotsBooked[slotDate].push(slotTime)

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotDate,
            slotTime,
            date: Date.now()
        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

        await doctorModel.findByIdAndUpdate(docId, { slots_booked: slotsBooked })

        res.json({ success: true, message: "Appointment booked" })
    } catch (err) {
        console.error('bookAppointment error:', err.message)
        res.json({ success: false, message: "Error booking appointment" })
    }
}

// ================= LIST APPOINTMENTS =================
const listAppointments = async (req, res) => {
    try {
        const userId = req.userId
        const appointments = await appointmentModel.find({ userId }).sort({ date: -1 })

        res.json({
            success: true,
            appointments,
            totalAppointments: appointments.length
        })
    } catch (err) {
        console.error('listAppointments error:', err.message)
        res.json({ success: false, message: "Error fetching appointments" })
    }
}

// ================= CANCEL APPOINTMENT =================
const cancelAppointment = async (req, res) => {
    try {
        const userId = req.userId
        const { appointmentId } = req.body

        const appointment = await appointmentModel.findById(appointmentId)

        if (!appointment) {
            return res.json({ success: false, message: "Appointment not found" })
        }

        // FIX: Use .toString() to safely compare ObjectId vs string
        if (appointment.userId.toString() !== userId.toString()) {
            return res.json({ success: false, message: "Not authorized to cancel this appointment" })
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        const doctor = await doctorModel.findById(appointment.docId)
        const slotsBooked = doctor?.slots_booked || {}

        if (slotsBooked[appointment.slotDate]) {
            slotsBooked[appointment.slotDate] = slotsBooked[appointment.slotDate].filter(
                (time) => time !== appointment.slotTime
            )
        }

        await doctorModel.findByIdAndUpdate(appointment.docId, { slots_booked: slotsBooked })

        res.json({ success: true, message: "Appointment cancelled" })
    } catch (err) {
        console.error('cancelAppointment error:', err.message)
        res.json({ success: false, message: "Error cancelling appointment" })
    }
}

// ================= PAYMENT - CREATE RAZORPAY ORDER =================
const paymentRazorpay = async (req, res) => {
    try {
        const userId = req.userId
        const { appointmentId } = req.body

        if (!appointmentId) {
            return res.json({ success: false, message: "Appointment is required" })
        }

        const appointment = await appointmentModel.findById(appointmentId)

        if (!appointment) {
            return res.json({ success: false, message: "Appointment not found" })
        }

        // FIX: Use .toString() to safely compare ObjectId vs string
        if (appointment.userId.toString() !== userId.toString()) {
            return res.json({ success: false, message: "Not authorized to pay for this appointment" })
        }

        if (appointment.cancelled) {
            return res.json({ success: false, message: "Cancelled appointments cannot be paid" })
        }

        if (appointment.payment) {
            return res.json({ success: false, message: "Appointment is already paid" })
        }

        const razorpayInstance = createRazorpayInstance()
        const order = await razorpayInstance.orders.create({
            amount: Math.round(appointment.amount * 100),
            currency: "INR",
            receipt: `appt_${appointment._id.toString().slice(-24)}`,
            notes: {
                appointmentId: appointment._id.toString(),
                userId
            }
        })

        appointment.razorpayOrderId = order.id
        await appointment.save()

        res.json({ success: true, order })
    } catch (err) {
        console.error('paymentRazorpay error:', err.message)
        res.json({
            success: false,
            message: err.message === 'Razorpay is not configured'
                ? "Payment service is not configured"
                : "Error creating payment order"
        })
    }
}

// ================= PAYMENT - VERIFY RAZORPAY =================
const verifyRazorpay = async (req, res) => {
    try {
        const userId = req.userId
        const { appointmentId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

        if (!appointmentId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.json({ success: false, message: "Payment verification details are required" })
        }

        const appointment = await appointmentModel.findById(appointmentId)

        if (!appointment) {
            return res.json({ success: false, message: "Appointment not found" })
        }

        // FIX: Use .toString() to safely compare ObjectId vs string
        if (appointment.userId.toString() !== userId.toString()) {
            return res.json({ success: false, message: "Not authorized to verify this payment" })
        }

        if (appointment.cancelled) {
            return res.json({ success: false, message: "Cancelled appointments cannot be paid" })
        }

        if (appointment.payment) {
            return res.json({ success: false, message: "Appointment is already paid" })
        }

        if (appointment.razorpayOrderId !== razorpay_order_id) {
            return res.json({ success: false, message: "Payment order mismatch" })
        }

        if (!process.env.RAZORPAY_KEY_SECRET) {
            return res.json({ success: false, message: "Payment service is not configured" })
        }

        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex')

        const signatureBuffer = Buffer.from(razorpay_signature)
        const generatedSignatureBuffer = Buffer.from(generatedSignature)

        if (
            signatureBuffer.length !== generatedSignatureBuffer.length ||
            !crypto.timingSafeEqual(signatureBuffer, generatedSignatureBuffer)
        ) {
            return res.json({ success: false, message: "Payment verification failed" })
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, {
            payment: true,
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id
        })

        res.json({ success: true, message: "Payment successful" })
    } catch (err) {
        console.error('verifyRazorpay error:', err.message)
        res.json({ success: false, message: "Error verifying payment" })
    }
}

export {
    registerUser,
    loginUser,
    forgotPassword,
    verifyResetCode,
    resetPassword,
    getProfile,
    updateProfile,
    listDoctors,
    bookAppointment,
    listAppointments,
    cancelAppointment,
    paymentRazorpay,
    verifyRazorpay
}
