import React from 'react'
import { assets_frontend } from '../assets/assets'
import { NavLink } from 'react-router-dom'
const Navbar = () => {
  return (
    <div className="flex items-center justify-between text-sm py-3 mb-3 border-b border-b-gray-400">

      <img src={assets_frontend.siteLogo} className='w-10 cursor-pointer' />


      <ul className='hidden md:flex items-start gap-5 font-medium'>
        <NavLink to ='/'>
          <li className='py-1'>HOME</li>
          <hr className='border-none outline-none h-0.5 bg-black w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to ='/doctors'>
          <li className='py-1'>ALL DOCTORS</li>
          <hr className='border-none outline-none h-0.5 bg-black w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to ='/about'>
          <li className='py-1'>ABOUT</li>
          <hr className='border-none outline-none h-0.5 bg-black w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to ='/contact'>
          <li className='py-1'>CONTACT</li>
          <hr className='border-none outline-none h-0.5 bg-black w-3/5 m-auto hidden' />
        </NavLink>
      </ul>
      <button>create account</button>
      <button>Login</button>
    </div>
  )
}

export default Navbar