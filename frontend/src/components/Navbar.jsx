import React, { useState } from 'react'
import { assets_frontend } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'

const Navbar = () => {

  const navigate = useNavigate();

  let [showMenu, setShowMenu] = useState(false)
  let [showDropdown, setShowDropdown] = useState(false)
  let [token, setToken] = useState(true)
  return (
    <div className="flex items-center justify-between text-sm py-2 px-2 mb-6 mt-3 border-gray-500 shadow-md">
      <div className="flex items-center gap-2 ">
        <img onClick={() => { navigate('/ ') }} src={assets_frontend.logo} className='w-32 cursor-pointer' />

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
            ?
            <div onClick={() => setShowDropdown(!showDropdown)} className='flex items-center gap-2.5 cursor-pointer group relative'>
              <img className='w-8 rounded-full' src={assets_frontend.profile_pic} />
              <img className='w-2.5' src={assets_frontend.dropdown_icon} />
              <div className={`absolute top-0 right-0 pt-14 text-sm font-medium text-gray-600 z-30 ${showDropdown ? "block" : "hidden"}`}  >
                <div className='min-w-48 bg-stone-100 flex flex-col gap-4 p-4 rounded-md'>
                  <p onClick={() => navigate('/my-profile')} className="hover:text-black cursor-pointer">My Profile</p>
                  <p onClick={() => navigate('/my-appointments')} className="hover:text-black cursor-pointer">My Appointments</p>
                  <p onClick={() => setToken(false)} className="hover:text-black cursor-pointer">Logout</p>
                </div>
              </div>
            </div>
            : <button onClick={() => navigate("/login")} className="px-8 py-3 rounded-md text-sm cursor-pointer font-medium hidden md:block hover:bg-amber-400 hover:text-white border transition-all duration-200 ">LOGIN</button>

        }
        <img onClick={() => setShowMenu(true)} className='w-6 md:hidden' src={assets_frontend.menu_icon} />

        <div className={`${showMenu ? 'fixed w-full' : 'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
          <div className='flex items-center justify-between px-3 py-2'>
            <img className="w-32" src={assets_frontend.logo} alt="SiteLogo" />
            <img className='w-6' onClick={() => setShowMenu(false)} src={assets_frontend.cross_icon} alt='cross icon' />
          </div>
          <ul className='flex flex-col items-center gap-2 mt-5 text-md font-medium '>
            <NavLink onClick={() => setShowMenu(false)} to="/"><p className='px-4 py-2 rounded inline-block'>HOME</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/doctors"><p className='px-4 py-2 rounded inline-block'>ALL DOCTORS</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/about"><p className='px-4 py-2 rounded inline-block'>ABOUT</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/contact"><p className='px-4 py-2 rounded inline-block'>CONTACT</p></NavLink>
          </ul>
        </div>

      </div>
    </div>
  )
}

export default Navbar