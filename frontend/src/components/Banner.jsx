import React from 'react'
import { useNavigate } from 'react-router-dom'
import { assets, assets_frontend } from '../assets/assets';

const Banner = () => {

    let navigate = useNavigate();
    return (
        <div className="flex rounded-lg px-6 sm:px-10 md:px-14 lg:px-12 md:mx-10 bg-amber-400">
            <div className="flex-1 flex-col gap-4 items-start justify-center md:my-10 am:py-10 md:py-16 lg:py-12" >
                <div className='flex flex-col'>
                    <p className='text-4xl font-bold text-white '>Book Appointments </p>
                    <p className='text-4xl font-bold text-white mt-4 '>With 100+ Trusted Doctors</p>
                </div>
                <button onClick={() => { navigate('/login'); scrollTo(0,0) }} className='bg-white py-3 px-8 rounded-full text-gray-800 cursor-pointer mt-4 mb-4 hover:scale-105 transition-all duration:200'>create Account</button>
            </div>
            <div className='hidden md:block md:w-1/2 lg:w-[370px] relative '>
                <img className="w-full absolute bottom-0 right-1 max-w-md" src={assets_frontend.appointment_img} />
            </div>
        </div>
    )
}

export default Banner