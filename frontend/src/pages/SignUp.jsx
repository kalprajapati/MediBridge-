import React, { useState, useContext, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { assets_frontend } from '../assets/assets'

const SignUp = () => {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { token, setToken, backendUrl } = useContext(AppContext)

  useEffect(() => { if (token) navigate('/') }, [token])

  const submitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await axios.post(backendUrl + '/register', { name, email, password })
      if (data.success) { localStorage.setItem('token', data.token); setToken(data.token) }
      else toast.error(data.message)
    } catch (err) { toast.error(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl flex rounded-2xl overflow-hidden shadow-xl border border-blue-100">

        {/* Left panel */}
        <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-blue-600 to-blue-700 w-[48%] flex-shrink-0 p-10 relative overflow-hidden">
          <NavLink to="/">
            <img src={assets_frontend.logo} className="h-9 w-auto brightness-0 invert" alt="Logo" />
          </NavLink>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white leading-tight mb-3">Start your care journey in minutes.</h2>
            <p className="text-blue-100 text-sm leading-relaxed">Join thousands of patients who trust Prescripto for seamless healthcare access.</p>
          </div>
          <img src={assets_frontend.appointment_img} className="absolute bottom-0 right-0 w-3/4 opacity-20" alt="" />
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/3 translate-x-1/3" />
        </div>

        {/* Right panel */}
        <div className="flex-1 bg-white p-8 sm:p-10 flex flex-col justify-center">
          <div className="max-w-sm mx-auto w-full">
            <NavLink to="/" className="lg:hidden flex mb-6">
              <img src={assets_frontend.logo} className="h-8 w-auto" alt="Logo" />
            </NavLink>
            <h3 className="text-2xl font-bold text-slate-800 mb-1">Create Account</h3>
            <p className="text-sm text-slate-400 mb-7">
              Already have an account?{' '}
              <NavLink to="/login" className="text-blue-600 font-medium hover:underline">Sign in</NavLink>
            </p>

            <form onSubmit={submitHandler} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="form-label">Full Name</label>
                <input className="input-field" type="text" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="form-label">Email</label>
                <input className="input-field" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="form-label">Password</label>
                <input className="input-field" type="password" placeholder="Min 8 chars with uppercase, number & symbol" value={password} onChange={e => setPassword(e.target.value)} required />
                <p className="text-xs text-slate-400 mt-0.5">Must contain uppercase, lowercase, number and special character</p>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-1">
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Creating account…</>
                ) : 'Create Account'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp
