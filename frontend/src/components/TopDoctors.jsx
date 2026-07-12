import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const DoctorCard = ({ item, onClick }) => (
  <div className="doctor-card" onClick={onClick}>
    <img
      className="doctor-card-img"
      src={item.image}
      alt={item.name}
    />
    <div className="doctor-card-body">
      <div className="flex items-center gap-1.5 mb-2">
        <span className="avail-dot green"></span>
        <span className="text-xs font-medium text-green-600">Available</span>
      </div>
      <p className="font-semibold text-slate-800 text-sm leading-snug">{item.name}</p>
      <p className="text-xs text-blue-500 font-medium mt-0.5">{item.speciality}</p>
    </div>
  </div>
)

const TopDoctors = () => {
  const navigate = useNavigate()
  const { doctors } = useContext(AppContext)

  return (
    <section className="py-14 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <span className="badge badge-blue mb-3">OUR DOCTORS</span>
          <h2 className="section-title">Top Doctors to Book</h2>
          <p className="section-sub mt-3">
            Simply browse through our extensive list of trusted, verified doctors.
          </p>
        </div>

        <div className="doctor-grid">
          {doctors.slice(0, 10).map((item, index) => (
            <DoctorCard
              key={index}
              item={item}
              onClick={() => navigate(`/appointment/${item._id}`)}
            />
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <button
            onClick={() => { navigate('/doctors'); scrollTo(0, 0) }}
            className="btn-outline"
          >
            View All Doctors
            <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

export default TopDoctors