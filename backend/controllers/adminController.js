import validator from 'validator'
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import adminModel from '../models/adminModel.js'
import jwt from 'jsonwebtoken'

// ================= ADD DOCTOR =================
const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees } = req.body;
        const address = JSON.parse(req.body.address);
        const imgFile = req.file;

        // Validation
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.json({ success: false, message: "Make sure you fill every details..!" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        if (!imgFile) {
            return res.json({ success: false, message: "Doctor image required" });
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

        if (!passwordRegex.test(password)) {
            return res.json({
                success: false,
                message: "Password must contain uppercase, lowercase, number and special character"
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        // Upload image
        const imageUpload = await cloudinary.uploader.upload(imgFile.path, {
            resource_type: "image"
        });

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
        };

        const newDoc = new doctorModel(doctorData);
        await newDoc.save();

        res.json({ success: true, message: "Doctor Added!" });

    } catch (err) {
        console.log(err);
        res.json({ success: false, message: "Error adding doctor!" });
    }
};


// ================= LOGIN ADMIN =================
const loginAdmin = async (req, res) => {
    try {
        console.log("BODY:", req.body); // debug

        const email = req.body?.email;
        const password = req.body?.password;

        // Validate input
        if (!email || !password) {
            return res.json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Check admin
        const admin = await adminModel.findOne({ email });

        if (!admin) {
            return res.json({
                success: false,
                message: "No admin found!"
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.json({
                success: false,
                message: "Invalid credentials!"
            });
        }

        // Generate token
        const token = jwt.sign(
            { id: admin._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            success: true,
            message: "Login successful!",
            token
        });

    } catch (err) {
        console.log(err);
        res.json({ success: false, message: "Error logging in!" });
    }
};

// ================= ALL DOCTORS =================
const allDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select('-password').sort({ date: -1 });

        res.json({
            success: true,
            doctors
        });
    } catch (err) {
        console.log(err);
        res.json({
            success: false,
            message: "Error fetching doctors!"
        });
    }
};

export { addDoctor, loginAdmin, allDoctors };
