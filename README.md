# Prescripto - Healthcare & Doctor Appointment Booking Platform

Prescripto (MediBridge) is a full-stack doctor appointment booking application designed to streamline healthcare access for patients while providing doctors and platform administrators with efficient management tools. Built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js), it provides a responsive, secure, and intuitive user experience.

---

## 🚀 Features

### 👤 Patient / User Portal
- **User Authentication**: Secure registration, login, JWT token authentication, rate-limiting, and password reset via email OTP (Nodemailer).
- **Doctor Exploration**: Browse doctors by medical specialization or search for top doctors across various departments.
- **Appointment Scheduling**: Real-time slot selection and server-validated appointment booking system to prevent past or double bookings.
- **Appointment Management**: View booking history and track status (Upcoming, Paid, Completed, Cancelled) with the option to cancel appointments.
- **Online Payments**: Integrated payment processing using Razorpay HMAC verification.
- **Profile Management**: Update personal details (phone, address, DOB, gender) and upload profile images via Cloudinary.

### 🛡️ Admin Dashboard
- **Admin Authentication**: Dedicated authentication route for platform managers.
- **Doctor Management**: Add new doctors with complete professional credentials, profile picture, experience, and fee breakdown, as well as remove doctors.
- **Analytics & Dashboard Overview**: Visual statistics tracking total doctors, appointments, total patients, and recent bookings.
- **Appointment Status Control**: Mark appointments as completed once consultation is finalized.

---

## 🛠️ Tech Stack & Architecture

### **Frontend**
- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS & Lucide Icons
- **Routing**: React Router DOM (v6)
- **HTTP Client**: Axios with JWT Interceptors/Headers
- **Notifications**: React Toastify

### **Backend**
- **Runtime**: Node.js & Express.js (ES Modules)
- **Database**: MongoDB Atlas with Mongoose ODM
- **Authentication**: JSON Web Token (JWT) & bcrypt (Password Hashing)
- **Security & Reliability**: Express Rate Limit & CORS restriction to white-listed origins
- **Media Storage**: Cloudinary SDK (Image Uploads)
- **Mailing Service**: Nodemailer (SMTP Password Reset)
- **Payments**: Razorpay Node SDK & HMAC SHA-256 Signature Verification

---

## 📂 Project Structure

```text
Prescripto/
├── backend/
│   ├── config/          # Database, Cloudinary, Razorpay & Email configurations
│   ├── controllers/     # Controller logic for User and Admin actions
│   ├── middlewares/     # JWT Auth (authUser, authAdmin) and Multer file upload
│   ├── models/          # Mongoose Schemas (User, Doctor, Appointment, Admin)
│   ├── routes/          # API route definitions (userRoutes, adminRoutes)
│   └── server.js        # Express app initialization and global middlewares
└── frontend/
    ├── src/
    │   ├── assets/      # Static images and icons
    │   ├── components/  # Reusable UI components & Layout wrappers
    │   ├── context/     # App Context state management
    │   └── pages/       # Patient pages & Admin dashboard components
```

---

## ⚡ Quick Start & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB connection string
- Cloudinary Account
- Razorpay Merchant Account (Key & Secret)
- SMTP Mail Account (e.g., Gmail App Password)

### 1. Clone Repository
```bash
git clone https://github.com/kalprajapati/Prescripto.git
cd Prescripto
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
PORT=8080
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=your_email@gmail.com

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Start backend development server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend` directory:
```env
VITE_BACKEND_URL=http://localhost:8080/api/user
VITE_ADMIN_BACKEND_URL=http://localhost:8080/api/admin
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

Start frontend development server:
```bash
npm run dev
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page or submit a pull request.

---

## 📜 License

This project is licensed under the [ISC License](LICENSE).