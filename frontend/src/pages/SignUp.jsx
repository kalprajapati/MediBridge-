import React, { useState, useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import Footer from '../components/Footer';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify'
import axios from 'axios'
import { useEffect } from 'react';
import { assets_frontend } from '../assets/assets';

const SignUp = () => {
  let navigate = useNavigate();
  let [email, setEmail] = useState("");
  let [name, setName] = useState("");
  let [password, setPassword] = useState("");
  const { token, setToken, backendUrl } = useContext(AppContext);

  let submitHandler = async (e) => {
    e.preventDefault();
    try {
      let { data } = await axios.post(backendUrl + '/register', { name, email, password })
      console.log(data)
      if (data.success) {
        localStorage.setItem('token', data.token)
        setToken(data.token)

      } else {
        console.log(data.message)
        toast.error(data.message)
      }
    } catch (err) {
      console.log(err);
    }

  }

  useEffect(() => {
    if (token) {
      navigate('/login')
    }
  }, [token])

  return (
    <div className='min-h-screen bg-slate-50 flex flex-col'>
      <div className='w-full px-4 py-4 sm:px-8 lg:px-12'>
        <div className='mx-auto flex max-w-6xl items-center justify-between'>
          <NavLink to='/' className='flex items-center'>
            <img src={assets_frontend.logo} alt="MediBridge" className='h-10 w-auto' />
          </NavLink>
          <NavLink to='/' className='rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-950'>
            Back to home
          </NavLink>
        </div>
      </div>

      <main className='mx-auto grid w-full max-w-6xl flex-1 items-center gap-8 px-4 pb-10 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-12'>
        <section className='hidden overflow-hidden rounded-2xl bg-[#5f6fff] lg:block'>
          <div className='relative min-h-[620px] p-10 text-white'>
            <div className='relative z-10 max-w-md'>
              <p className='mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-white/75'>Prescripto</p>
              <h1 className='text-4xl font-semibold leading-tight'>Start your care journey in minutes.</h1>
            </div>
            <img src={assets_frontend.appointment_img} alt="Doctor consultation" className='absolute bottom-0 right-0 w-[82%] max-w-[520px]' />
          </div>
        </section>

        <section className='w-full'>
          <div className='mx-auto flex w-full max-w-md flex-col gap-4 rounded-2xl bg-white px-5 py-6 shadow-xl shadow-slate-200/70 sm:px-8 sm:py-8'>
            <div className='flex flex-col mb-3'>
              <h2 className='text-2xl font-semibold text-gray-700'>SIGN UP</h2>
              <h4 className='text-sm text-gray-700'>Please Sign Up to use our services.</h4>
            </div>
            <div>
              <form onSubmit={submitHandler} method='post' className='flex flex-col gap-5 mb-4 '>

                <input placeholder='Email' name='email' type='text' onChange={(e) => setEmail(e.target.value)} value={email} required className='border px-3 py-1 rounded-sm border-gray-400' />
                <input placeholder='Username' name='username' type='text' onChange={(e) => setName(e.target.value)} value={name} required className='border px-3 py-1 rounded-sm border-gray-400' />
                <input placeholder='Password' name="password" type='password' value={password} onChange={(e) => { setPassword(e.target.value) }} required className='border px-3 py-1 rounded-sm border-gray-400' />
                <button className='px-3 py-1 rounded-sm bg-amber-400 text-white font-md cursor-pointer hover:bg-amber-500 transition-all duration-50' type='submit'>Sign Up</button>
              </form>

            </div>


            <p className='text-sm'>Already have an account ? <NavLink to='/login' className="text-blue-500 underline hover:text-blue-700">Login now</NavLink></p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default SignUp
