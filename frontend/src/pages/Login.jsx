import React, { useEffect, useState, useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { assets_frontend } from '../assets/assets'

const InputField = ({ label, ...props }) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="form-label">{label}</label>}
    <input className="input-field" {...props} />
  </div>
)

const Login = ({ adminMode = false }) => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginMode, setLoginMode] = useState(adminMode ? 'admin' : 'user')
  const [resetStep, setResetStep] = useState('login')
  const [resetCode, setResetCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const { token, setToken, adminToken, setAdminToken, backendUrl, adminBackendUrl } = useContext(AppContext)
  const isAdmin = loginMode === 'admin'

  useEffect(() => {
    if (isAdmin && adminToken) navigate('/admin/dashboard')
    else if (!isAdmin && token) navigate('/')
  }, [token, adminToken, isAdmin])

  const submitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const url = (isAdmin ? adminBackendUrl : backendUrl) + '/login'
      const { data } = await axios.post(url, { email, password })
      if (data.success) {
        if (isAdmin) { localStorage.setItem('adminToken', data.token); setAdminToken(data.token) }
        else { localStorage.setItem('token', data.token); setToken(data.token) }
      } else toast.error(data.message)
    } catch (err) { toast.error(err.message) }
    finally { setLoading(false) }
  }

  const sendResetCode = async (e) => {
    e.preventDefault(); setLoading(true)
    try {
      const { data } = await axios.post(backendUrl + '/forgot-password', { email })
      if (data.success) { toast.success(data.message); setResetStep('code') }
      else toast.error(data.message)
    } catch (err) { toast.error(err.message) }
    finally { setLoading(false) }
  }

  const verifyResetCode = async (e) => {
    e.preventDefault(); setLoading(true)
    try {
      const { data } = await axios.post(backendUrl + '/verify-reset-code', { email, otp: resetCode })
      if (data.success) { toast.success(data.message); setResetStep('password') }
      else toast.error(data.message)
    } catch (err) { toast.error(err.message) }
    finally { setLoading(false) }
  }

  const resetPassword = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) { toast.error('Passwords do not match'); return }
    setLoading(true)
    try {
      const { data } = await axios.post(backendUrl + '/reset-password', { email, otp: resetCode, password: newPassword })
      if (data.success) { toast.success(data.message); setResetStep('login'); setResetCode(''); setNewPassword(''); setConfirmPassword('') }
      else toast.error(data.message)
    } catch (err) { toast.error(err.message) }
    finally { setLoading(false) }
  }

  const isResetFlow = resetStep !== 'login'

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl flex rounded-2xl overflow-hidden shadow-xl border border-blue-100">

        {/* Left panel (decorative) */}
        <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-blue-600 to-blue-700 w-[48%] flex-shrink-0 p-10 relative overflow-hidden">
          <NavLink to="/">
            <img src={assets_frontend.logo} className="h-9 w-auto brightness-0 invert" alt="Logo" />
          </NavLink>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white leading-tight mb-3">
              {isAdmin ? 'Admin Portal' : isResetFlow ? 'Reset Your Password' : 'Welcome Back'}
            </h2>
            <p className="text-blue-100 text-sm leading-relaxed">
              {isAdmin
                ? 'Manage doctors, appointments and platform stats from one dashboard.'
                : isResetFlow
                ? 'Follow the steps to securely reset your account password.'
                : 'Book appointments with top doctors. Your health, simplified.'}
            </p>
          </div>
          <img
            src={assets_frontend.appointment_img}
            className="absolute bottom-0 right-0 w-3/4 opacity-20"
            alt=""
          />
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/3 translate-x-1/3" />
        </div>

        {/* Right panel (form) */}
        <div className="flex-1 bg-white p-8 sm:p-10 flex flex-col justify-center">
          <div className="max-w-sm mx-auto w-full">

            {/* Mobile logo */}
            <NavLink to="/" className="lg:hidden flex mb-6">
              <img src={assets_frontend.logo} className="h-8 w-auto" alt="Logo" />
            </NavLink>

            <h3 className="text-2xl font-bold text-slate-800 mb-1">
              {isAdmin ? 'Admin Login' : isResetFlow ? 'Reset Password' : 'Sign In'}
            </h3>
            <p className="text-sm text-slate-400 mb-7">
              {isAdmin ? 'Enter admin credentials to continue' : isResetFlow ? 'Follow the steps below' : "Don't have an account? "}
              {!isAdmin && !isResetFlow && (
                <NavLink to="/signup" className="text-blue-600 font-medium hover:underline">Sign up</NavLink>
              )}
            </p>

            {/* Admin form */}
            {isAdmin && (
              <form onSubmit={submitHandler} className="flex flex-col gap-4">
                <InputField label="Admin Email" type="email" placeholder="admin@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                <InputField label="Password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                  {loading ? 'Signing in…' : 'Sign In as Admin'}
                </button>
                <button type="button" onClick={() => setLoginMode('user')} className="text-sm text-blue-600 hover:underline text-center">
                  Switch to User Login
                </button>
              </form>
            )}

            {/* User: Login */}
            {!isAdmin && resetStep === 'login' && (
              <form onSubmit={submitHandler} className="flex flex-col gap-4">
                <InputField label="Email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                <InputField label="Password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                <div className="flex justify-end">
                  <button type="button" onClick={() => setResetStep('email')} className="text-xs text-blue-600 hover:underline">Forgot password?</button>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                  {loading ? 'Signing in…' : 'Sign In'}
                </button>
                <button type="button" onClick={() => setLoginMode('admin')} className="text-sm text-slate-400 hover:text-blue-600 text-center transition">Admin Login →</button>
              </form>
            )}

            {/* Forgot: email step */}
            {!isAdmin && resetStep === 'email' && (
              <form onSubmit={sendResetCode} className="flex flex-col gap-4">
                <p className="text-sm text-slate-500 bg-blue-50 rounded-lg p-3 border border-blue-100">Enter your registered email and we'll send a 6-digit code.</p>
                <InputField label="Registered Email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                <button type="submit" disabled={loading} className="btn-primary w-full py-3">{loading ? 'Sending…' : 'Send Code'}</button>
                <button type="button" onClick={() => setResetStep('login')} className="text-sm text-slate-400 hover:text-slate-700 transition text-center">← Back to Login</button>
              </form>
            )}

            {/* Forgot: verify code */}
            {!isAdmin && resetStep === 'code' && (
              <form onSubmit={verifyResetCode} className="flex flex-col gap-4">
                <p className="text-sm text-slate-500 bg-blue-50 rounded-lg p-3 border border-blue-100">Enter the 6-digit code we sent to <strong>{email}</strong></p>
                <InputField label="6-Digit Code" type="text" inputMode="numeric" maxLength="6" placeholder="123456" value={resetCode} onChange={e => setResetCode(e.target.value)} required />
                <button type="submit" disabled={loading} className="btn-primary w-full py-3">{loading ? 'Verifying…' : 'Verify Code'}</button>
                <button type="button" onClick={() => setResetStep('email')} className="text-sm text-blue-600 hover:underline text-center">Resend code</button>
              </form>
            )}

            {/* Forgot: new password */}
            {!isAdmin && resetStep === 'password' && (
              <form onSubmit={resetPassword} className="flex flex-col gap-4">
                <InputField label="New Password" type="password" placeholder="New password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                <InputField label="Confirm Password" type="password" placeholder="Confirm password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                <button type="submit" disabled={loading} className="btn-primary w-full py-3">{loading ? 'Changing…' : 'Set New Password'}</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
