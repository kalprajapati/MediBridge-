import React, { useContext } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { assets, assets_frontend } from '../assets/assets'
import { AppContext } from '../context/AppContext'

const AdminLayout = () => {
  const navigate = useNavigate()
  const { setAdminToken } = useContext(AppContext)

  const logout = () => {
    localStorage.removeItem('adminToken')
    setAdminToken('')
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-800">
      <header className="flex items-center justify-between border-b bg-white px-4 py-3 shadow-sm sm:px-8">
        <div className="flex items-center gap-3">
          <img src={assets.admin_logo || assets_frontend.logo} alt="Admin" className="h-9" />
          <span className="rounded border px-2 py-1 text-xs font-medium text-zinc-600">Admin</span>
        </div>
        <button
          onClick={logout}
          className="rounded border px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-red-500 hover:text-white"
        >
          Logout
        </button>
      </header>

      <div className="flex flex-col sm:flex-row">
        <aside className="w-full border-b bg-white sm:min-h-[calc(100vh-65px)] sm:w-60 sm:border-b-0 sm:border-r">
          <nav className="flex gap-2 overflow-x-auto p-3 sm:flex-col sm:p-4">
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                `rounded px-4 py-2 text-sm font-medium ${isActive ? 'bg-amber-400 text-white' : 'text-zinc-600 hover:bg-zinc-100'}`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/admin/add-doctor"
              className={({ isActive }) =>
                `rounded px-4 py-2 text-sm font-medium ${isActive ? 'bg-amber-400 text-white' : 'text-zinc-600 hover:bg-zinc-100'}`
              }
            >
              Add Doctor
            </NavLink>
            <NavLink
              to="/admin/doctors"
              className={({ isActive }) =>
                `rounded px-4 py-2 text-sm font-medium ${isActive ? 'bg-amber-400 text-white' : 'text-zinc-600 hover:bg-zinc-100'}`
              }
            >
              Doctors List
            </NavLink>
          </nav>
        </aside>

        <main className="flex-1 p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
