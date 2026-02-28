import React, { useContext, useEffect, useState } from 'react'
import Footer from '../components/Footer'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext';

const Doctors = () => {

  const { speciality } = useParams();
  console.log(speciality);

  const { doctors } = useContext(AppContext);
  const navigate = useNavigate();

  let [filterDoc, setFilterDoc] = useState([]);

  let applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality))
    } else {
      setFilterDoc(doctors);
    }
  }

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality])

  return (
    <>
      <p>Browse through the Doctors.</p>
      <div className='flex flex-col sm:flex-row gap-5 items-start mt-5'>

        <div className='flex flex-col gap-2 text-sm text-gray-500'>
          <p onClick={() => { speciality === 'General physician' ? navigate('/doctors') : navigate('/doctors/General physician') }} className={`py-2 px-8 border border-gray-500 rounded-sm cursor-pointer ${speciality === "General physician" ? "bg-indigo-50 text-black" : ""}`}>General physician</p>
          <p onClick={() => { speciality === 'Gynecologist' ? navigate('/doctors') : navigate('/doctors/Gynecologist') }} className={`py-2 px-8 border border-gray-500 rounded-sm cursor-pointer ${speciality === "Gynecologist" ? "bg-indigo-50 text-black" : ""}`}>Gynecologist</p>
          <p onClick={() => { speciality === 'Dermatologist' ? navigate('/doctors') : navigate('/doctors/Dermatologist') }} className={`py-2 px-8 border border-gray-500 rounded-sm cursor-pointer ${speciality === "Dermatologist" ? "bg-indigo-50 text-black" : ""}`}>Dermatologist</p>
          <p onClick={() => { speciality === 'Pediatricians' ? navigate('/doctors') : navigate('/doctors/Pediatricians') }} className={`py-2 px-8 border border-gray-500 rounded-sm cursor-pointer ${speciality === "Pediatricians" ? "bg-indigo-50 text-black" : ""}`}>Pediatricians</p>
          <p onClick={() => { speciality === 'Neurologist' ? navigate('/doctors') : navigate('/doctors/Neurologist') }} className={`py-2 px-8 border border-gray-500 rounded-sm cursor-pointer ${speciality === "Neurologist" ? "bg-indigo-50 text-black" : ""}`}>Neurologist</p>
          <p onClick={() => { speciality === 'Gastroenterologist' ? navigate('/doctors') : navigate('/doctors/Gastroenterologist') }} className={`py-2 px-8 border border-gray-500 rounded-sm cursor-pointer ${speciality === "Gastroenterologist" ? "bg-indigo-50 text-black" : ""}`}>Gastroenterologist</p>
        </div>
        <div className='w-full grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 gap-y-6 px-3 sm:px-0'>
          {
            filterDoc.map((item, index) => (
              <div onClick={() => navigate(`appointment/${item._id}`)} className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] duration-200 transition-all" key={index} >
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
      </div>
      <Footer />
    </>

  )
}

export default Doctors