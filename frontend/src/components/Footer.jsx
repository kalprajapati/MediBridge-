import React from 'react'
import { assets_frontend } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Footer = () => {
  const navigate = useNavigate()

  const links = {
    Company: [
      { label: 'Home', action: () => { navigate('/'); scrollTo(0, 0) } },
      { label: 'About Us', action: () => { navigate('/about'); scrollTo(0, 0) } },
      { label: 'Doctors', action: () => { navigate('/doctors'); scrollTo(0, 0) } },
      { label: 'Contact Us', action: () => { navigate('/contact'); scrollTo(0, 0) } },
    ],
    Legal: [
      { label: 'Privacy Policy', action: () => {} },
      { label: 'Terms of Service', action: () => {} },
    ],
  }

  return (
    <footer className="bg-white border-t border-blue-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">

          {/* Brand */}
          <div className="sm:col-span-1">
            <img src={assets_frontend.logo} className="h-9 w-auto mb-4" alt="Prescripto" />
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              Prescripto is a smart healthcare platform designed to simplify doctor discovery and appointment scheduling with a smooth, user-friendly experience.
            </p>
          </div>

          {/* Links */}
          {Object.entries(links).map(([heading, items]) => (
            <div key={heading}>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">{heading}</h3>
              <ul className="space-y-2.5">
                {items.map(({ label, action }) => (
                  <li key={label}>
                    <button
                      onClick={action}
                      className="text-sm text-slate-500 hover:text-blue-600 transition-colors"
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-blue-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-400">
            © 2026 Prescripto · All rights reserved
          </p>
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <span>📞</span>
            <span>+91-90330-90280</span>
            <span className="mx-2">·</span>
            <span>✉️</span>
            <span>kalprajapati1803@gmail.com</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer