import React, { useContext, useEffect, useState } from 'react'
import Footer from '../components/Footer'
import { useParams, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import { assets_frontend } from '../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';
const Appointment = () => {
  let { docID } = useParams();
  let { doctors, currencySymbol, token, backendUrl, loadDoctors } = useContext(AppContext);
  let [docInfo, setDocInfo] = useState(null);

  let [relativeDocs, setRelativeDocs] = useState();

  let navigate = useNavigate();

  let [slots, setSlots] = useState([]);
  let [selectedDate, setSelectedDate] = useState();
  let [selectedTime, setSelectedTime] = useState();
  let [booking, setBooking] = useState(false);


  let fetchDoc = async () => {
    let docInfo = await doctors.find((doc) =>
      doc._id === docID
    )
    setDocInfo(docInfo);
    console.log(docInfo);
  }

  let fetchRelativeDocs = async () => {
    if (!docInfo) return;
    let rDocs = await doctors.filter((doc) => (
      doc.speciality === docInfo.speciality && doc._id !== docInfo._id

    ))
    setRelativeDocs(rDocs);
  }

  useEffect(() => {
    fetchRelativeDocs();
  }, [docInfo])

  console.log(relativeDocs);

  let generateSlots = () => {
    let tempSlots = [];
    for (let i = 0; i < 7; i++) {
      let date = new Date();
      date.setDate(date.getDate() + i);
      const slotDate = [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0')
      ].join('-');

      let daySlots = {
        dateObj: date,
        slotDate,
        date: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        times: [
          "09:00 AM",
          "10:00 AM",
          "11:00 AM",
          "12:00 PM",
          "03:00 PM",
          "04:00 PM",
        ],
      };

      tempSlots.push(daySlots);
    }
    setSlots(tempSlots);
    setSelectedTime(tempSlots[0].times[0]);
    setSelectedDate(tempSlots[0]);
  }

  const bookAppointment = async () => {
    if (!token) {
      toast.error('Login to book appointment')
      navigate('/login')
      return
    }

    if (!selectedDate || !selectedTime) {
      toast.error('Select appointment date and time')
      return
    }

    try {
      setBooking(true)
      const { data } = await axios.post(backendUrl + '/book-appointment', {
        docId: docID,
        slotDate: selectedDate.slotDate,
        slotTime: selectedTime
      }, { headers: { token } })

      if (data.success) {
        toast.success(data.message)
        await loadDoctors()
        navigate('/my-appointments')
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      console.log(err)
      toast.error(err.message)
    } finally {
      setBooking(false)
    }
  }

  console.log(slots);

  useEffect(() => {
    fetchDoc();
  }, [doctors, docID, ''])

  useEffect(() => {
    generateSlots();
  }, [])



  return (

    <div className='flex flex-col justify-center text-gray-700 '>
      {docInfo ? (
        <>
          <div className=' flex flex-col items-center sm:flex-row gap-6 overflow-hidden'>
            <div className='w-full  md:w-1/3 shrink-0 h-full'>
              <img className=' bg-amber-300 rounded-xl h-full object-cover' src={docInfo?.image} />
            </div>

            <div className='flex flex-col md:w-2/3 gap-2 border rounded-xl px-4 py-6 sm:px-8 sm:py-10 border-gray-900 h-auto '>
              <div className='flex gap-3 items-center'>
                <h2 className='text-4xl font-semibold text-gray-700'>{docInfo.name} </h2>
                <img className='w-6' src={assets_frontend.verified_icon} />
              </div>

              <div className='flex flex-col sm:flex-row gap-3 sm:items-center justify-start'>
                <h3>{docInfo.degree} - {docInfo.speciality}</h3>
                <h3 className='border px-5 py-1 rounded-full w-24 '>{docInfo.experience}</h3>
              </div>

              <div className='flex flex-col gap-3 my-4 '>
                <div className='flex items-center gap-2 '>
                  <img className="w-4" src={assets_frontend.info_icon} />
                  <span><p className='text-lg font-semibold'>About</p></span>
                </div>
                <p className=''>
                  {docInfo.about}
                </p>
              </div>
              <h3 className='text-2xl font-ligh' >Appointment Fees:<span className='font-semibold'> {currencySymbol}{docInfo.fees}</span></h3>
            </div>

          </div>
          <div className='flex flex-col my-8 md:ml-108 gap-6' >
            <p className='text-xl font-md text-gray-700'>Booking Slots</p>
            <div className="flex flex-wrap  md:flex-row gap-4 text-gray-500">
              {slots.map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedDate(item);
                    setSelectedTime(null); // reset time when date changes
                  }}
                  className={`flex flex-col border border-gray-400 w-16 h-24 items-center justify-center rounded-full text-xl cursor-pointer
                  ${(selectedDate === item) ? "bg-amber-400 text-white shadow-md border-white " : "bg-white"}`}
                >
                  <p>{item.day}</p>
                  <p>{item.date}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-4 mt-6">
              {selectedDate?.times.map((time, index) => {
                const booked = docInfo.slots_booked?.[selectedDate.slotDate]?.includes(time)

                return (
                <button
                  key={index}
                  onClick={() => !booked && setSelectedTime(time)}
                  disabled={booked}
                  className={`px-4 py-2 rounded-lg border border-gray-500 
                  ${selectedTime === time ? "bg-amber-400 text-white border-white shadow-md" : "text-gray-500"} ${booked ? "cursor-not-allowed bg-gray-100 text-gray-300 line-through" : "cursor-pointer"}`}
                >
                  {time}
                </button>
                )
              })}
            </div>
            <button onClick={bookAppointment} disabled={booking || !selectedTime} className='max-w-60 py-3 px-10 rounded-full bg-amber-400 text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-60'>
              {booking ? 'Booking...' : 'Book Appointment'}
            </button>
          </div>
          <div className='flex flex-col justify-center items-center mt-8 gap-8 '>
            <div className='flex  flex-col items-center gap-3'>
              <h2 className='text-xl md:text-2xl font-semibold'>Related doctors</h2>
              <p>Simply browse through our extensive list of Doctors</p>
            </div>
            <div className='min-w-2/3 flex justify-center flex-row'>
              <div className='w-full grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 gap-y-6 px-3 sm:px-0 '>
                {
                  relativeDocs?.map((item, index) => (
                    <div onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }} className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] duration-200 transition-all" key={index} >
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
          </div>

        </>
      ) : (
        <p >Loading</p>
      )
      }

      <Footer />
    </div>
  )
}

export default Appointment
