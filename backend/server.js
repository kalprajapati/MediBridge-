import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import rateLimit from 'express-rate-limit'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoutes.js'
import userRouter from './routes/userRoutes.js'

// App config
const app = express()
const port = process.env.PORT || 4000

connectDB()
connectCloudinary()

// FIX: Restrict CORS to allowed origins only (not wildcard)
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
    : ['http://localhost:5173', 'http://localhost:3000']

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g., curl, Postman, server-to-server)
        if (!origin) return callback(null, true)
        if (allowedOrigins.includes(origin)) return callback(null, true)
        return callback(new Error(`CORS policy: origin ${origin} not allowed`))
    },
    credentials: true
}))

// Middlewares
app.use(express.json())

// FIX: Rate limiting on auth-sensitive routes to prevent brute-force
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20,                  // max 20 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests, please try again later.' }
})

// Apply rate limiting to authentication endpoints
app.use('/api/user/login', authLimiter)
app.use('/api/user/register', authLimiter)
app.use('/api/user/forgot-password', authLimiter)
app.use('/api/user/verify-reset-code', authLimiter)
app.use('/api/user/reset-password', authLimiter)
app.use('/api/admin/login', authLimiter)

// API endpoints
app.use('/api/admin', adminRouter)
app.use('/api/user', userRouter)

app.get('/', (req, res) => {
    res.json({ success: true, message: "Prescripto API is running!" })
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})