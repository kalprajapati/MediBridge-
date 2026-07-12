import React, { useContext, useEffect, useState } from 'react'
import Footer from '../components/Footer'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const SPECIALITIES = [
  'General physician',
  'Gynecologist',
  'Dermatologist',
  'Pediatricians',
  'Neurologist',
  'Gastroenterologist',
]

const Doctors = () => {
  const { speciality } = useParams()
  const { doctors } = useContext(AppContext)
  const navigate = useNavigate()

  const [filterDoc, setFilterDoc] = useState([])
  const [showFilter, setShowFilter] = useState(false)

  useEffect(() => {
    setFilterDoc(speciality ? doctors.filter(d => d.speciality === speciality) : doctors)
  }, [doctors, speciality])

  const handleFilter = (spec) => {
    if (speciality === spec) navigate('/doctors')
    else navigate(`/doctors/${spec}`)
    scrollTo(0, 0)
  }

  return (
    <>
      <div className="page-wrapper fade-up">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Find a Doctor</h1>
          <p className="text-slate-500 text-sm mt-1">
            {speciality ? `Showing specialists in "${speciality}"` : 'Browse all available doctors'}
            {filterDoc.length > 0 && <span className="ml-2 badge badge-blue">{filterDoc.length} found</span>}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6">
          {/* Sidebar filter */}
          <aside>
            {/* Mobile toggle */}
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="sm:hidden mb-3 flex items-center gap-2 btn-outline text-sm py-2 px-4"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
              </svg>
              {showFilter ? 'Hide Filters' : 'Filter by Speciality'}
            </button>

            <div className={`bg-white border border-blue-100 rounded-xl p-4 shadow-sm w-full sm:w-52 ${showFilter ? 'block' : 'hidden sm:block'}`}>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3 px-1">Speciality</p>
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => navigate('/doctors')}
                  className={`filter-pill ${!speciality ? 'active' : ''}`}
                >
                  All Doctors
                </button>
                {SPECIALITIES.map(spec => (
                  <button
                    key={spec}
                    onClick={() => handleFilter(spec)}
                    className={`filter-pill ${speciality === spec ? 'active' : ''}`}
                  >
                    {spec}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Doctors grid */}
          <div className="flex-1">
            {filterDoc.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-5xl mb-4">🩺</div>
                <p className="text-slate-600 font-medium">No doctors found</p>
                <p className="text-slate-400 text-sm mt-1">Try a different speciality or check back later</p>
                <button onClick={() => navigate('/doctors')} className="btn-outline mt-6 text-sm">Clear Filter</button>
              </div>
            ) : (
              <div className="doctor-grid">
                {filterDoc.map((item, index) => (
                  <div
                    key={index}
                    className="doctor-card"
                    onClick={() => { navigate(`appointment/${item._id}`); scrollTo(0, 0) }}
                  >
                    <img className="doctor-card-img" src={item.image} alt={item.name} />
                    <div className="doctor-card-body">
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className={`avail-dot ${item.available ? 'green' : 'red'}`}></span>
                        <span className={`text-xs font-medium ${item.available ? 'text-green-600' : 'text-red-500'}`}>
                          {item.available ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                      <p className="font-semibold text-slate-800 text-sm leading-snug">{item.name}</p>
                      <p className="text-xs text-blue-500 font-medium mt-0.5">{item.speciality}</p>
                      <p className="text-xs text-slate-400 mt-1">{item.experience} exp.</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Doctors