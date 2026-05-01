import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import Footer from '../components/Footer';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify'
import axios from 'axios'
const Login = ({ adminMode = false }) => {
  let navigate = useNavigate();
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  const { token, setToken, adminToken, setAdminToken, backendUrl, adminBackendUrl, isAdmin, setIsAdmin } = useContext(AppContext);
  const loginAsAdmin = adminMode || isAdmin

  let submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post((loginAsAdmin ? adminBackendUrl : backendUrl) + '/login', { email, password })
      console.log(data)

      if (data.success) {
        if (loginAsAdmin) {
          localStorage.setItem('adminToken', data.token)
          setAdminToken(data.token)
        } else {
          localStorage.setItem('token', data.token)
          setToken(data.token)
        }

      } else {
        console.log(data.message)
        toast.error(data.message)
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (loginAsAdmin) {
      if (adminToken) {
        console.log("admin logged in successfully!")
        navigate('/admin/dashboard')  // navigate admin somewhere
      }
    } else {
      if (token) {
        navigate('/')
      }
    }
  }, [token, adminToken, loginAsAdmin, navigate])

  return (

    <div className='w-auto flex flex-col items-center justify-center mt-10'>

      <div className='flex flex-col gap-4 px-4 py-4 md:px-10 md:py-10 rounded-2xl shadow-xl w-full md:w-1/3'>
        <div className='flex flex-col mb-3'>
          <h2 className='text-2xl font-semibold text-gray-700'>LOGIN</h2>
          <h4 className='text-sm text-gray-700'>Please Login to book appointment</h4>
        </div>

        <div>
          {loginAsAdmin ?
            <>
              <form onSubmit={submitHandler} method='post' className='flex flex-col gap-5 mb-4 '>
                <input placeholder='Admin Email' name='email' type='text' onChange={(e) => setEmail(e.target.value)} value={email} required className='border px-3 py-1 rounded-sm border-gray-400' />
                <input placeholder='Admin Password' name="password" type='password' value={password} onChange={(e) => { setPassword(e.target.value) }} required className='border px-3 py-1 rounded-sm border-gray-400' />
                <button className='px-3 py-1 rounded-sm bg-amber-400 text-white font-md cursor-pointer hover:bg-amber-500 transition-all duration-50' type='submit'>Login</button>
              </form>
              {!adminMode && <p className='underline text-blue-500 hover:text-blue-700 cursor-pointer' onClick={() => { setIsAdmin(false) }}>User Login</p>}
            </>

            : <>
              <form onSubmit={submitHandler} method='post' className='flex flex-col gap-5 mb-4 '>
                <input placeholder='Email' name='email' type='text' onChange={(e) => setEmail(e.target.value)} value={email} required className='border px-3 py-1 rounded-sm border-gray-400' />
                <input placeholder='Password' name="password" type='password' value={password} onChange={(e) => { setPassword(e.target.value) }} required className='border px-3 py-1 rounded-sm border-gray-400' />
                <button className='px-3 py-1 rounded-sm bg-amber-400 text-white font-md cursor-pointer hover:bg-amber-500 transition-all duration-50' type='submit'>Login</button>
              </form>
              <p className='underline text-blue-500 hover:text-blue-700 cursor-pointer' onClick={() => { setIsAdmin(true) }}>Admin Login</p>
            </>
          }



        </div>


        {!loginAsAdmin && <p className='text-sm'>Don't have an account? <NavLink to='/signup' className="text-blue-500 underline hover:text-blue-700">sign up now</NavLink></p>}
      </div>
      <Footer />
    </div>
  )
}

export default Login
