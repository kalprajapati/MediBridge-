import React from 'react'
import { useNavigate } from 'react-router-dom'
import { assets_frontend } from '../assets/assets'

const Banner = () => {
  const navigate = useNavigate()

  return (
    <section className="py-14 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 overflow-hidden flex flex-col md:flex-row items-center relative shadow-lg">

          {/* Content */}
          <div className="flex-1 px-8 py-12 md:px-12 md:py-14 text-white z-10">
            <h2 className="text-3xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-4">
              Book Appointments<br />
              With 100+ Trusted Doctors
            </h2>
            <p className="text-blue-100 text-sm sm:text-base mb-8 max-w-md leading-relaxed">
              Your health matters. Create an account today and get instant access to top specialists near you.
            </p>
            <button
              onClick={() => navigate('/signup')}
              className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold text-sm px-7 py-3 rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              Create Free Account
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-6 mt-10">
              {[
                { num: '100+', label: 'Doctors' },
                { num: '10K+', label: 'Patients' },
                { num: '30+', label: 'Specialities' },
              ].map(({ num, label }) => (
                <div key={label}>
                  <p className="text-2xl font-bold">{num}</p>
                  <p className="text-blue-200 text-xs">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Doctor image */}
          <div className="hidden md:flex md:w-72 lg:w-96 items-end justify-end self-stretch relative">
            <img
              className="h-full max-h-80 object-cover object-top w-full"
              src={assets_frontend.appointment_img}
              alt="Doctor"
            />
          </div>

          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/4 pointer-events-none" />
        </div>
      </div>
    </section>
  )
}

export default Banner