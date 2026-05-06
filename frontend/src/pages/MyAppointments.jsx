import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
const MyAppointments = () => {

  const { backendUrl, token, currencySymbol, loadDoctors } = useContext(AppContext)
  const [appointments, setAppointments] = useState([])
  const [totalAppointments, setTotalAppointments] = useState(0)
  const [loading, setLoading] = useState(true)
  const [cancellingId, setCancellingId] = useState('')
  const navigate = useNavigate()

  const getUserAppointments = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(backendUrl + '/appointments', {
        headers: { token }
      })

      if (data.success) {
        setAppointments(data.appointments)
        setTotalAppointments(data.totalAppointments)
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      console.log(err)
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const cancelAppointment = async (appointmentId) => {
    try {
      setCancellingId(appointmentId)
      const { data } = await axios.post(backendUrl + '/cancel-appointment', { appointmentId }, {
        headers: { token }
      })

      if (data.success) {
        toast.success(data.message)
        await getUserAppointments()
        await loadDoctors()
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      console.log(err)
      toast.error(err.message)
    } finally {
      setCancellingId('')
    }
  }

  const formatDate = (slotDate) => {
    return new Date(slotDate).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }

    getUserAppointments()
  }, [token])

  if (loading) {
    return <p className='pb-3 mt-12 font-medium text-zinc-700'>Loading appointments...</p>
  }

  return (
    <div>
      <div className='pb-3 mt-12 border-b'>
        <p className='font-medium text-zinc-700'>My Appointments</p>
        <p className='text-sm text-zinc-500'>Total appointments: {totalAppointments}</p>
      </div>
      <div className=''>
        {appointments.length === 0 && (
          <p className='py-6 text-sm text-zinc-500'>You have not booked any appointments yet.</p>
        )}
        {appointments.map((item) => (
          <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b' key={item._id}>
            <div>
              <img className='w-32 bg-indigo-200' src={item.docData.image} />
            </div>
            <div className='flex-1 text-sm text-zinc-600'>
              <p className='text-neutral-800 font-semibold'>{item.docData.name}</p>
              <p>{item.docData.speciality}</p>
              <p className='text-neutral-800 font-medium mt-1'>Address:</p>
              <p className='text-xs'>{item.docData.address.line1}</p>
              <p className='text-xs'>{item.docData.address.line2}</p>
              <p className='text-sm mt-1'><span className='text-neutral-800 font-medium'>Date & Time:</span> {formatDate(item.slotDate)} | {item.slotTime}</p>
              <p className='text-sm mt-1'><span className='text-neutral-800 font-medium'>Fees:</span> {currencySymbol}{item.amount}</p>
              <p className={`text-sm mt-1 ${item.cancelled ? 'text-red-500' : item.isCompleted ? 'text-green-600' : 'text-amber-600'}`}>
                {item.cancelled ? 'Cancelled' : item.isCompleted ? 'Completed' : 'Upcoming'}
              </p>
            </div>
            <div className='flex flex-col gap-2 justify-end'>
              {!item.cancelled && !item.payment && <button className='border min-w-40 px-6 py-2 sm:min-w-48 text-sm text-stone-500 text-center rounded hover:bg-amber-400 hover:text-white transition-all'>Pay Online</button>}
              {!item.cancelled && !item.isCompleted && (
                <button
                  onClick={() => cancelAppointment(item._id)}
                  disabled={cancellingId === item._id}
                  className='border min-w-40 px-6 py-2 sm:min-w-48 text-sm text-stone-500 text-center rounded hover:bg-red-500 hover:text-white transition-all disabled:cursor-not-allowed disabled:opacity-60'
                >
                  {cancellingId === item._id ? 'Cancelling...' : 'Cancel Booking'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyAppointments
