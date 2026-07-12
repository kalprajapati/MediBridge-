import express from 'express'
import { addDoctor, allDoctors, deleteDoctor, loginAdmin, getDashboardStats, markAppointmentCompleted } from '../controllers/adminController.js'
import upload from '../middlewares/multer.js'
import authAdmin from '../middlewares/authAdmin.js'

const adminRouter = express.Router()

adminRouter.post('/login', loginAdmin)
adminRouter.post('/add-doctor', authAdmin, upload.single('image'), addDoctor)
adminRouter.get('/all-doctors', authAdmin, allDoctors)
// FIX: Removed duplicate POST route — now only using DELETE (correct HTTP verb)
adminRouter.delete('/delete-doctor/:doctorId', authAdmin, deleteDoctor)
// FIX: New dashboard stats endpoint
adminRouter.get('/dashboard', authAdmin, getDashboardStats)
// FIX: New mark-completed endpoint so isCompleted flag can be set
adminRouter.post('/mark-completed', authAdmin, markAppointmentCompleted)

export default adminRouter
