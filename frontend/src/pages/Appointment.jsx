import React, { useContext, useEffect, useState } from 'react'
import Footer from '../components/Footer'
import { useParams, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets_frontend } from '../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'

const Appointment = () => {
  const { docID } = useParams()
  const { doctors, currencySymbol, token, backendUrl, loadDoctors } = useContext(AppContext)
  const navigate = useNavigate()

  const [docInfo, setDocInfo] = useState(null)
  const [relativeDocs, setRelativeDocs] = useState([])
  const [slots, setSlots] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [booking, setBooking] = useState(false)

  useEffect(() => {
    const doc = doctors.find(d => d._id === docID)
    setDocInfo(doc || null)
  }, [doctors, docID])

  useEffect(() => {
    if (docInfo) {
      setRelativeDocs(doctors.filter(d => d.speciality === docInfo.speciality && d._id !== docInfo._id))
    }
  }, [docInfo])

  useEffect(() => {
    const tempSlots = []
    for (let i = 0; i < 7; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      const slotDate = [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0'),
      ].join('-')
      tempSlots.push({
        dateObj: date,
        slotDate,
        date: date.getDate(),
        month: date.getMonth(),
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        times: ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '03:00 PM', '04:00 PM'],
      })
    }
    setSlots(tempSlots)
    setSelectedDate(tempSlots[0])
    setSelectedTime(tempSlots[0].times[0])
  }, [])

  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const bookAppointment = async () => {
    if (!token) { toast.error('Login to book an appointment'); navigate('/login'); return }
    if (!selectedDate || !selectedTime) { toast.error('Select a date and time'); return }
    try {
      setBooking(true)
      const { data } = await axios.post(backendUrl + '/book-appointment', {
        docId: docID,
        slotDate: selectedDate.slotDate,
        slotTime: selectedTime,
      }, { headers: { token } })
      if (data.success) { toast.success(data.message); await loadDoctors(); navigate('/my-appointments') }
      else toast.error(data.message)
    } catch (err) { toast.error(err.message) }
    finally { setBooking(false) }
  }

  if (!docInfo) {
    return (
      <div className="page-wrapper flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-slate-400 text-sm">Loading doctor info…</p>
      </div>
    )
  }

  return (
    <div className="fade-up">
      <div className="page-wrapper">

        {/* Doctor info card */}
        <div className="flex flex-col sm:flex-row gap-6 mb-8">
          {/* Photo */}
          <div className="w-full sm:w-56 md:w-64 flex-shrink-0">
            <div className="rounded-2xl overflow-hidden bg-blue-50 aspect-square w-full">
              <img className="w-full h-full object-cover object-top" src={docInfo.image} alt={docInfo.name} />
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 bg-white border border-blue-100 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-slate-800">{docInfo.name}</h1>
              <img className="w-5 h-5" src={assets_frontend.verified_icon} alt="Verified" />
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="badge badge-blue">{docInfo.speciality}</span>
              <span className="badge" style={{ background: '#f0f9ff', color: '#0369a1' }}>{docInfo.degree}</span>
              <span className="badge" style={{ background: '#f0fdf4', color: '#166534' }}>{docInfo.experience} exp</span>
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-1.5 mb-2">
                <img className="w-4 h-4" src={assets_frontend.info_icon} alt="About" />
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">About</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{docInfo.about}</p>
            </div>

            <div className="divider" />
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">Consultation Fee:</span>
              <span className="text-lg font-bold text-blue-600">{currencySymbol}{docInfo.fees}</span>
            </div>
          </div>
        </div>

        {/* Booking section */}
        <div className="bg-white border border-blue-100 rounded-2xl p-6 sm:p-8 shadow-sm mb-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-6">Select Appointment Slot</h2>

          {/* Date picker */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Choose a Date</p>
            <div className="flex gap-2.5 overflow-x-auto pb-2">
              {slots.map((item, index) => (
                <button
                  key={index}
                  onClick={() => { setSelectedDate(item); setSelectedTime(null) }}
                  className={`slot-date ${selectedDate === item ? 'active' : ''}`}
                >
                  <span className="text-xs opacity-80">{item.day}</span>
                  <span className="text-xl font-bold mt-0.5">{item.date}</span>
                  <span className="text-xs opacity-70">{MONTHS[item.month]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Time picker */}
          <div className="mt-6">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Choose a Time</p>
            <div className="flex flex-wrap gap-2.5">
              {selectedDate?.times.map((time, index) => {
                const booked = docInfo.slots_booked?.[selectedDate.slotDate]?.includes(time)
                return (
                  <button
                    key={index}
                    onClick={() => !booked && setSelectedTime(time)}
                    disabled={booked}
                    className={`slot-time ${selectedTime === time ? 'active' : ''}`}
                  >
                    {time}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Summary & Book */}
          {selectedDate && selectedTime && (
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="text-sm text-slate-600">
                <span className="font-medium text-slate-800">Booking: </span>
                {selectedDate.day}, {selectedDate.date} {MONTHS[selectedDate.month]} · {selectedTime}
              </div>
              <div className="text-sm text-slate-600">
                <span className="font-medium text-slate-800">Fee: </span>
                {currencySymbol}{docInfo.fees}
              </div>
            </div>
          )}

          <button
            onClick={bookAppointment}
            disabled={booking || !selectedTime}
            className="btn-primary mt-5 w-full sm:w-auto px-10 py-3"
          >
            {booking ? (
              <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Booking…</>
            ) : 'Confirm Appointment'}
          </button>
        </div>

        {/* Related doctors */}
        {relativeDocs.length > 0 && (
          <div>
            <div className="text-center mb-6">
              <h2 className="section-title text-xl">Related Doctors</h2>
              <p className="section-sub text-sm mt-1">Other {docInfo.speciality} specialists</p>
            </div>
            <div className="doctor-grid">
              {relativeDocs.slice(0, 4).map((item, index) => (
                <div
                  key={index}
                  className="doctor-card"
                  onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }}
                >
                  <img className="doctor-card-img" src={item.image} alt={item.name} />
                  <div className="doctor-card-body">
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="avail-dot green"></span>
                      <span className="text-xs font-medium text-green-600">Available</span>
                    </div>
                    <p className="font-semibold text-slate-800 text-sm">{item.name}</p>
                    <p className="text-xs text-blue-500 font-medium mt-0.5">{item.speciality}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default Appointment
