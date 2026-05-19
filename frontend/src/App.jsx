import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Navigate, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import Login from './pages/Login'
import About from './pages/About'
import Contact from './pages/Contact'
import MyProfile from './pages/MyProfile'
import MyAppointments from './pages/MyAppointments'
import Appointment from './pages/Appointment'
import Navbar from './components/Navbar'
import SignUp from './pages/SignUp'
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css" 
import AdminProtectedRoute from './components/AdminProtectedRoute'
import AdminLayout from './components/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AddDoctor from './pages/admin/AddDoctor'
import DoctorsList from './pages/admin/DoctorsList'

const App = () => {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/admin/login'
  const showNavbar = !isAdminRoute && !isAuthRoute

  return (
    <>
      <ToastContainer />
      <div className={isAdminRoute || isAuthRoute ? '' : 'mx-4 sm:mx-[2%]'}>
       {showNavbar && <Navbar />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctors/:speciality" element={<Doctors />} />
          <Route path="/login" element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/my-appointments" element={<MyAppointments />} />
          <Route path="appointment/:docID" element={<Appointment />} />
          <Route path="/doctors/:speciality/appointment/:docID" element={<Appointment />} />
          <Route path="/doctors/appointment/:docID" element={<Appointment />} />
          <Route path="/admin/login" element={<Login adminMode />} />
          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="add-doctor" element={<AddDoctor />} />
            <Route path="doctors" element={<DoctorsList />} />
          </Route>
          
        </Routes>
      </div>
    </>
  )
}

export default App
