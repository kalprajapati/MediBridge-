import React from 'react'
import { assets_frontend } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Footer = () => {
    let navigate = useNavigate();
    return (
        <div className='md:mx-10'>


            <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-gray-500 font-light border-b-gray-500 md:pb-4">
                {/** -------left side------- */}
                <div className=''>
                    <div className="flex items-center gap-2 ">
                        <img src={assets_frontend.logo} className='w-40 cursor-pointer' />

                    </div>
                    <p className='mt-4 text-sm'>
                        MEDIBRIDGE is a smart healthcare platform designed to simplify <br />doctor discovery and appointment scheduling with a smooth, user-friendly experience.
                    </p>
                </div>


                {/** -------middle side------- */}
                <div className='text-sm '>
                    <h2 className='mb-5'>COMPANY</h2>
                    <ul className='leading-7 cursor-pointer'>
                        <li onClick={() => { navigate('/'); scrollTo(0, 0) }}>Home</li>
                        <li>About Us</li>
                        <li>Contact Us</li>
                        <li>Privacy Policy</li>
                    </ul>
                </div>
                {/** -------right side------- */}
                <div className='mb-4 text-sm ' >
                    <h2 className='mb-5'>GET IN TOUCH</h2>
                    <ul className='leading-7'>
                        <li>+91-90330-90280</li>
                        <li>kalprajapati1803@gmail.com</li>
                    </ul>
                </div>
               

            </div>
            
            <p className='text-center text-sm my-4 font-light'>Copyright © 2026 Prescripto - All Right Reserved.</p>

        </div>
    )
}

export default Footer