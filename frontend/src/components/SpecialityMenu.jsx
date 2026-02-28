import React from 'react'
import { assets, assets_frontend, specialityData } from '../assets/assets'
import { Link } from 'react-router-dom'

const SpecialityMenu = () => {
    return (
        <div id="speciality" className="flex flex-col justify-center items-center mt-16 gap-4 px-4">
            <h1 className='font-medium md:text-3xl sm:text-2xl text-gray-900 '>Find by Speciality</h1>
            <p className=' sm:w-1/3 text-center text-sm '>Simply browse through our extensive list of trusted doctors,
                schedule your appointment hassle-free</p>
            <div className='flex gap-4 sm:justify-center pt-5 md:overflow-scroll'>
                {
                    specialityData.map((item, index) => (
                        <Link onClick={() => scrollTo(0, 0)} className="flex flex-col items-center text-xs cursor-pointer shrink-0 hover:translate-y-[-10px] duration-200" key={index} to={`/doctors/${item.speciality}`}>
                            <img className="w-16 sm:w-24 mb-2" src={item.image} />
                            <p> {item.speciality}</p>
                        </Link>
                    ))
                }
            </div>
        </div>
    )
}

export default SpecialityMenu