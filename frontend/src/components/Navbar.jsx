import React, { useContext, useState } from 'react'
import { assets_frontend } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Navbar = () => {
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const { token, setToken, userData } = useContext(AppContext)

  const logOut = () => {
    setToken('')
    localStorage.removeItem('token')
    setShowDropdown(false)
  }

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/doctors', label: 'Doctors' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <nav className="navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">

        {/* Logo */}
        <img
          onClick={() => navigate('/')}
          src={assets_frontend.logo}
          className="h-9 w-auto cursor-pointer"
          alt="Prescripto"
        />

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `nav-link px-3 py-1.5 rounded-lg ${isActive ? 'active-link text-blue-600' : ''}`
              }
            >
              {label}
            </NavLink>
          ))}
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {token && userData ? (
            <div className="relative" onClick={() => setShowDropdown(!showDropdown)}>
              <button className="flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1.5 transition hover:border-blue-300 hover:bg-blue-100">
                <img
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-blue-200"
                  src={userData.image}
                  alt={userData.name}
                />
                <span className="hidden sm:block text-sm font-medium text-slate-700 max-w-24 truncate">
                  {userData.name}
                </span>
                <svg className={`w-3.5 h-3.5 text-slate-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showDropdown && (
                <div className="absolute right-0 top-12 w-48 rounded-xl bg-white border border-blue-100 shadow-lg py-1.5 z-50 fade-up">
                  {[
                    { label: 'My Profile', icon: '👤', path: '/my-profile' },
                    { label: 'My Appointments', icon: '📅', path: '/my-appointments' },
                  ].map(({ label, icon, path }) => (
                    <button
                      key={path}
                      onClick={() => { navigate(path); setShowDropdown(false) }}
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition text-left"
                    >
                      <span>{icon}</span> {label}
                    </button>
                  ))}
                  <div className="my-1 mx-3 border-t border-slate-100" />
                  <button
                    onClick={logOut}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition text-left"
                  >
                    <span>🚪</span> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="btn-primary hidden md:flex px-5 py-2 text-sm"
            >
              Sign In
            </button>
          )}

          {/* Hamburger */}
          <button
            onClick={() => setShowMenu(true)}
            className="md:hidden p-2 rounded-lg hover:bg-blue-50 text-slate-600 transition"
            aria-label="Open menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {showMenu && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div className="flex-1 bg-black/20" onClick={() => setShowMenu(false)} />
          <div className="w-72 bg-white h-full shadow-2xl flex flex-col fade-up">
            <div className="flex items-center justify-between px-5 py-4 border-b border-blue-100">
              <img src={assets_frontend.logo} className="h-8 w-auto" alt="Prescripto" />
              <button
                onClick={() => setShowMenu(false)}
                className="p-2 rounded-lg hover:bg-blue-50 text-slate-500"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col gap-1 px-3 py-4">
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setShowMenu(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-lg text-sm font-medium transition ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>
            <div className="mt-auto px-5 py-5 border-t border-blue-100">
              {token ? (
                <div className="flex flex-col gap-2">
                  <button onClick={() => { navigate('/my-profile'); setShowMenu(false) }} className="btn-outline w-full text-sm py-2.5">My Profile</button>
                  <button onClick={() => { logOut(); setShowMenu(false) }} className="w-full text-sm py-2.5 text-red-500 hover:bg-red-50 rounded-full transition">Logout</button>
                </div>
              ) : (
                <button onClick={() => { navigate('/login'); setShowMenu(false) }} className="btn-primary w-full text-sm">Sign In</button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar