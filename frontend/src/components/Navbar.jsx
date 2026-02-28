import React, { useState } from 'react'
import { assets_frontend } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'

const Navbar = () => {

  const navigate = useNavigate();

  let [profile, setProfile] = useState(false)
  let [token, setToken] = useState(true)
  return (
    <div className="flex items-center justify-between text-sm py-2 px-2 mb-6 mt-3  border-b border-gray-500">
      <div className="flex items-center gap-2 ">
        <img onClick={()=>{navigate('/')}} src={assets_frontend.logo} className='w-32 cursor-pointer' />
        
      </div>



      <ul className='hidden md:flex items-start gap-5 font-medium '>
        <NavLink to='/'>
          <li className='py-1 hover:text-amber-400  transition-all duration-200'>HOME</li>
          <hr className='border-none outline-none h-0.5 bg-black w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/doctors'>
          <li className='py-1 hover:text-amber-400 transition-all duration-200'>ALL DOCTORS</li>
          <hr className='border-none outline-none h-0.5 bg-black w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/about'>
          <li className='py-1 hover:text-amber-400 transition-all duration-200'>ABOUT</li>
          <hr className='border-none outline-none h-0.5 bg-black w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/contact'>
          <li className='py-1 hover:text-amber-400'>CONTACT</li>
          <hr className='border-none outline-none h-0.5 bg-black w-3/5 m-auto hidden' />
        </NavLink>
      </ul>
      <div className="flex items-center gap-4">
        {
          token
            ? <div className='flex items-center gap-2.5 cursor-pointer group relative'>
              <img className='w-8 rounded-full' src={assets_frontend.profile_pic} />
              <img className='w-2.5' src={assets_frontend.dropdown_icon} />
              <div className='absolute top-0 right-0 pt-14 text-sm font-medium text-gray-600 z-20 hidden group-hover:block '  >
                <div className='min-w-48 bg-stone-100 flex flex-col gap-4 p-4 rounded-md'>
                  <p onClick={() => navigate('/my-profile')} className="hover:text-black cursor-pointer">My Profile</p>
                  <p onClick={() => navigate('/my-appointments')} className="hover:text-black cursor-pointer">My Appointments</p>
                  <p onClick={() => setToken(false)} className="hover:text-black cursor-pointer">Logout</p>
                </div>
              </div>
            </div>
            : <button onClick={() => navigate("/login")} className="bg-blue-400 text-white px-8 py-3 rounded-md text-sm cursor-pointer font-medium hidden md:block">create account</button>

        }


      </div>
    </div>
  )
}

export default Navbar