import React from 'react'
import { assets_frontend } from '../assets/assets'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <section className="hero-bg rounded-2xl overflow-hidden mx-0 mb-10 mt-2">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-12 md:py-0 flex flex-col md:flex-row items-center gap-8 md:gap-0">

        {/* Left content */}
        <div className="flex-1 flex flex-col items-start gap-6 py-0 md:py-16 fade-up">

          {/* Trust badge */}
          <div className="flex items-center gap-2 bg-white/80 border border-blue-200 rounded-full px-4 py-2 backdrop-blur-sm shadow-sm">
            <span className="avail-dot green"></span>
            <span className="text-xs font-semibold text-blue-700 tracking-wide">100+ Verified Doctors Online</span>
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 leading-tight">
              Book Appointments<br />
              <span className="text-blue-600">with Trusted Doctors</span>
            </h1>
            <p className="mt-4 text-slate-500 text-sm sm:text-base max-w-md leading-relaxed">
              Browse our extensive list of certified specialists and schedule your appointment — quick, simple, and hassle-free.
            </p>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <a
              href="#speciality"
              className="btn-primary gap-2 text-sm px-7 py-3"
            >
              Book Appointment
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <Link to="/doctors" className="btn-ghost text-sm font-medium text-blue-600">
              Browse Doctors →
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-3 mt-2">
            <img className="w-24 rounded-full" src={assets_frontend.group_profiles} alt="Patients" />
            <div>
              <p className="text-sm font-semibold text-slate-700">10,000+ patients</p>
              <p className="text-xs text-slate-400">trust us with their care</p>
            </div>
          </div>
        </div>

        {/* Right image */}
        <div className="flex-1 flex justify-center md:justify-end relative min-h-[240px] md:min-h-[380px] w-full">
          <img
            className="w-full max-w-sm md:max-w-none md:w-auto md:h-96 object-cover object-top md:absolute md:bottom-0 md:right-0"
            src={assets_frontend.header_img}
            alt="Doctor"
          />
        </div>
      </div>
    </section>
  )
}

export default Header