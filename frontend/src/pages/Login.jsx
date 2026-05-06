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
  let [resetStep, setResetStep] = useState('login');
  let [resetCode, setResetCode] = useState("");
  let [newPassword, setNewPassword] = useState("");
  let [confirmPassword, setConfirmPassword] = useState("");
  let [loading, setLoading] = useState(false);
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

  const sendResetCode = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(backendUrl + '/forgot-password', { email })

      if (data.success) {
        toast.success(data.message)
        setResetStep('code')
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      console.log(err)
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const verifyResetCode = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(backendUrl + '/verify-reset-code', { email, otp: resetCode })

      if (data.success) {
        toast.success(data.message)
        setResetStep('password')
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      console.log(err)
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true);

    try {
      const { data } = await axios.post(backendUrl + '/reset-password', {
        email,
        otp: resetCode,
        password: newPassword
      })

      if (data.success) {
        toast.success(data.message)
        setPassword("")
        setResetCode("")
        setNewPassword("")
        setConfirmPassword("")
        setResetStep('login')
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      console.log(err)
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const backToLogin = () => {
    setResetStep('login')
    setResetCode("")
    setNewPassword("")
    setConfirmPassword("")
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
          <h2 className='text-2xl font-semibold text-gray-700'>{resetStep === 'login' ? 'LOGIN' : 'RESET PASSWORD'}</h2>
          <h4 className='text-sm text-gray-700'>
            {resetStep === 'login' ? 'Please Login to book appointment' : 'Use your registered email to change password'}
          </h4>
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

            : resetStep === 'login' ?
              <>
                <form onSubmit={submitHandler} method='post' className='flex flex-col gap-5 mb-4 '>
                  <input placeholder='Email' name='email' type='text' onChange={(e) => setEmail(e.target.value)} value={email} required className='border px-3 py-1 rounded-sm border-gray-400' />
                  <input placeholder='Password' name="password" type='password' value={password} onChange={(e) => { setPassword(e.target.value) }} required className='border px-3 py-1 rounded-sm border-gray-400' />
                  <button className='px-3 py-1 rounded-sm bg-amber-400 text-white font-md cursor-pointer hover:bg-amber-500 transition-all duration-50' type='submit'>Login</button>
                </form>
                <div className='flex flex-col gap-2'>
                  <button type='button' className='text-left underline text-blue-500 hover:text-blue-700 cursor-pointer' onClick={() => setResetStep('email')}>Forgot password?</button>
                  <p className='underline text-blue-500 hover:text-blue-700 cursor-pointer' onClick={() => { setIsAdmin(true) }}>Admin Login</p>
                </div>
              </>
              : resetStep === 'email' ?
                <form onSubmit={sendResetCode} method='post' className='flex flex-col gap-5 mb-4 '>
                  <input placeholder='Registered Email' name='email' type='email' onChange={(e) => setEmail(e.target.value)} value={email} required className='border px-3 py-1 rounded-sm border-gray-400' />
                  <button disabled={loading} className='px-3 py-1 rounded-sm bg-amber-400 text-white font-md cursor-pointer hover:bg-amber-500 disabled:opacity-60 transition-all duration-50' type='submit'>{loading ? 'Sending...' : 'Send Code'}</button>
                  <button type='button' className='text-left underline text-blue-500 hover:text-blue-700 cursor-pointer' onClick={backToLogin}>Back to login</button>
                </form>
                : resetStep === 'code' ?
                  <form onSubmit={verifyResetCode} method='post' className='flex flex-col gap-5 mb-4 '>
                    <input placeholder='6 Digit Code' name='resetCode' type='text' inputMode='numeric' maxLength='6' onChange={(e) => setResetCode(e.target.value)} value={resetCode} required className='border px-3 py-1 rounded-sm border-gray-400' />
                    <button disabled={loading} className='px-3 py-1 rounded-sm bg-amber-400 text-white font-md cursor-pointer hover:bg-amber-500 disabled:opacity-60 transition-all duration-50' type='submit'>{loading ? 'Verifying...' : 'Verify Code'}</button>
                    <button type='button' className='text-left underline text-blue-500 hover:text-blue-700 cursor-pointer' onClick={() => setResetStep('email')}>Resend code</button>
                  </form>
                  :
                  <form onSubmit={resetPassword} method='post' className='flex flex-col gap-5 mb-4 '>
                    <input placeholder='New Password' name='newPassword' type='password' onChange={(e) => setNewPassword(e.target.value)} value={newPassword} required className='border px-3 py-1 rounded-sm border-gray-400' />
                    <input placeholder='Confirm Password' name='confirmPassword' type='password' onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} required className='border px-3 py-1 rounded-sm border-gray-400' />
                    <button disabled={loading} className='px-3 py-1 rounded-sm bg-amber-400 text-white font-md cursor-pointer hover:bg-amber-500 disabled:opacity-60 transition-all duration-50' type='submit'>{loading ? 'Changing...' : 'Change Password'}</button>
                    <button type='button' className='text-left underline text-blue-500 hover:text-blue-700 cursor-pointer' onClick={backToLogin}>Back to login</button>
                  </form>
          }



        </div>


        {!loginAsAdmin && resetStep === 'login' && <p className='text-sm'>Don't have an account? <NavLink to='/signup' className="text-blue-500 underline hover:text-blue-700">sign up now</NavLink></p>}
      </div>
      <Footer />
    </div>
  )
}

export default Login
