import express from 'express'
import { addDoctor, allDoctors, deleteDoctor, loginAdmin } from '../controllers/adminController.js'
import upload from '../middlewares/multer.js'
import authAdmin from '../middlewares/authAdmin.js'

const adminRouter = express.Router();

adminRouter.post('/add-doctor', authAdmin, upload.single('image'), addDoctor);
adminRouter.get('/all-doctors', authAdmin, allDoctors);
adminRouter.post('/delete-doctor/:doctorId', authAdmin, deleteDoctor);
adminRouter.delete('/delete-doctor/:doctorId', authAdmin, deleteDoctor);
adminRouter.post('/login',loginAdmin);

export default adminRouter
