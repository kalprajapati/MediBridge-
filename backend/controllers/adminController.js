import validator from 'validator'
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import adminModel from '../models/adminModel.js'
import appointmentModel from '../models/appointmentModel.js'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'

// ================= ADD DOCTOR =================
const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees } = req.body
        const imgFile = req.file

        // FIX: Safe JSON.parse with try-catch
        let address = {}
        try {
            address = req.body.address ? JSON.parse(req.body.address) : {}
        } catch {
            return res.json({ success: false, message: "Invalid address format" })
        }

        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.json({ success: false, message: "Make sure you fill every detail!" })
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        if (!imgFile) {
            return res.json({ success: false, message: "Doctor image required" })
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/
        if (!passwordRegex.test(password)) {
            return res.json({
                success: false,
                message: "Password must contain uppercase, lowercase, number and special character"
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPass = await bcrypt.hash(password, salt)

        const imageUpload = await cloudinary.uploader.upload(imgFile.path, { resource_type: "image" })

        const doctorData = {
            name,
            email,
            image: imageUpload.secure_url,
            password: hashedPass,
            speciality,
            degree,
            experience,
            about,
            fees,
            address,
            date: Date.now()
        }

        const newDoc = new doctorModel(doctorData)
        await newDoc.save()

        res.json({ success: true, message: "Doctor Added!" })

    } catch (err) {
        console.error('addDoctor error:', err.message)
        res.json({ success: false, message: "Error adding doctor!" })
    }
}

// ================= LOGIN ADMIN =================
const loginAdmin = async (req, res) => {
    try {
        const email = req.body?.email
        const password = req.body?.password

        if (!email || !password) {
            return res.json({ success: false, message: "Email and password are required" })
        }

        const admin = await adminModel.findOne({ email })

        if (!admin) {
            return res.json({ success: false, message: "No admin found!" })
        }

        const isMatch = await bcrypt.compare(password, admin.password)

        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials!" })
        }

        const token = jwt.sign(
            { id: admin._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        )

        res.json({ success: true, message: "Login successful!", token })

    } catch (err) {
        console.error('loginAdmin error:', err.message)
        res.json({ success: false, message: "Error logging in!" })
    }
}

// ================= ALL DOCTORS =================
const allDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select('-password').sort({ date: -1 })
        res.json({ success: true, doctors })
    } catch (err) {
        console.error('allDoctors error:', err.message)
        res.json({ success: false, message: "Error fetching doctors!" })
    }
}

// ================= DELETE DOCTOR =================
const deleteDoctor = async (req, res) => {
    try {
        const { doctorId } = req.params

        const doctor = await doctorModel.findById(doctorId)

        if (!doctor) {
            return res.json({ success: false, message: "Doctor not found!" })
        }

        await doctorModel.findByIdAndDelete(doctorId)

        res.json({ success: true, message: "Doctor removed!" })
    } catch (err) {
        console.error('deleteDoctor error:', err.message)
        res.json({ success: false, message: "Error removing doctor!" })
    }
}

// ================= DASHBOARD STATS =================
// FIX: Dashboard was showing '--' because this API didn't exist
const getDashboardStats = async (req, res) => {
    try {
        const [totalDoctors, totalAppointments, totalPatients] = await Promise.all([
            doctorModel.countDocuments(),
            appointmentModel.countDocuments(),
            userModel.countDocuments()
        ])

        const recentAppointments = await appointmentModel
            .find()
            .sort({ date: -1 })
            .limit(5)

        res.json({
            success: true,
            stats: {
                totalDoctors,
                totalAppointments,
                totalPatients
            },
            recentAppointments
        })
    } catch (err) {
        console.error('getDashboardStats error:', err.message)
        res.json({ success: false, message: "Error fetching dashboard stats!" })
    }
}

// ================= MARK APPOINTMENT COMPLETED =================
// FIX: isCompleted flag had no setter — now admin can mark it complete
const markAppointmentCompleted = async (req, res) => {
    try {
        const { appointmentId } = req.body

        if (!appointmentId) {
            return res.json({ success: false, message: "Appointment ID is required" })
        }

        const appointment = await appointmentModel.findById(appointmentId)

        if (!appointment) {
            return res.json({ success: false, message: "Appointment not found" })
        }

        if (appointment.cancelled) {
            return res.json({ success: false, message: "Cannot mark a cancelled appointment as completed" })
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })

        res.json({ success: true, message: "Appointment marked as completed" })
    } catch (err) {
        console.error('markAppointmentCompleted error:', err.message)
        res.json({ success: false, message: "Error updating appointment" })
    }
}

export { addDoctor, loginAdmin, allDoctors, deleteDoctor, getDashboardStats, markAppointmentCompleted }
