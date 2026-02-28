import React, { useContext } from 'react'
import { assets_frontend } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext';

const TopDoctors = () => {

  let navigate =  useNavigate();
  let {doctors} = useContext(AppContext);

  return (
    <div className="flex flex-col items-center gap-4 my-16 md:mx-10">
      <p className="text-3xl font-semibold text-gray-900">Top Doctors to Book</p>
      <p className="text-sm">Simply browse through our extensive list of trusted doctors.</p>
      <div className="w-full grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 gap-y-6 px-3 sm:px-0 ">
        {
          doctors.slice(0, 10).map((item, index) => (
            <div onClick = {()=>navigate(`appointment/${item._id}`)} className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] duration-200 transition-all"  key={index} >
              <img className="bg-blue-50  " src={item.image} />
              <div className='p-4'>
                <div className="flex gap-1.5 items-center " >
                  <p className="h-2 w-2 bg-green-500 rounded-full"></p>
                  <p className="text-green-500">Available</p>
                </div>

                <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                <p className='text-sm text-gray-500 font-medium'>{item.speciality}</p>
              </div>

            </div>


          ))
        }
      </div>
      <button onClick = {()=>{navigate("/doctors"); scrollTo(0,0)}} className='group flex gap-2 otems-center bg-blue-50 py-3 px-8 rounded-full text-center cursor-pointer hover:bg-blue-200 transition-all duration-200 text-gray-700'>
        more
        <img className = "w-4 hidden group-hover:block transition-all duration-1000" src = {assets_frontend.arrow_icon}></img>
      </button>

    </div>
  )
}

export default TopDoctors