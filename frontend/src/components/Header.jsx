import React from 'react'
import { assets_frontend } from '../assets/assets'
import { Link } from 'react-router-dom'

const Header = () => {
    return (
        <div className='flex flex-col md:flex-row flex-wrap border-amber-400 bg-amber-400 md:px-10 rounded-md'>
            {/*-------------left side---------*/}
            <div className="md:w-1/2 flex flex-col items-start justify-center gap-4 m-auto py-10 md:py-[10vw] md:-mb-7.5 ">
                <p className='text-white text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight md:leading-tight lg:leading-tight '>
                    Book Appointments <br /> with Trusted Doctors
                </p>
                <div className="flex flex-col md:flex-row items-center gap-3 text-white text-sm font-light">
                    <img className="w-28" src={assets_frontend.group_profiles} />
                    <p>simply browse through our extensive list of trusted doctors, <br />
                        schedult your appointments hassle-free</p>
                </div>
                <Link to='#speciality' className="flex gap-3 justify-aroundF px-8 py-3 rounded-full bg-white text-sm m-auto md:m-0 hover:scale-105 transition-all duration-300">Book Appointment
                    <img classname = "w-3" src={assets_frontend.arrow_icon} />
                </Link>

            </div>

            {/*----------right side------------*/}
            <div className="md:w-1/2 relative">
                <img className=' w-full md:absolute bottom-0 h-auto rounded-lg' src={assets_frontend.header_img} />
            </div>
        </div>
    )
}

export default Header