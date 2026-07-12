import React from 'react'
import { specialityData } from '../assets/assets'
import { Link } from 'react-router-dom'

const SpecialityMenu = () => {
  return (
    <section id="speciality" className="py-14 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <span className="badge badge-blue mb-3">SPECIALITIES</span>
          <h2 className="section-title">Find by Speciality</h2>
          <p className="section-sub mt-3">
            Browse certified specialists across every medical field — and book your appointment in seconds.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {specialityData.map((item, index) => (
            <Link
              key={index}
              to={`/doctors/${item.speciality}`}
              onClick={() => scrollTo(0, 0)}
              className="spec-chip"
            >
              <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
                <img className="w-9 h-9 object-contain" src={item.image} alt={item.speciality} />
              </div>
              <span className="text-center">{item.speciality}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SpecialityMenu