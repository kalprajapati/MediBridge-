import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../../context/AppContext'

const DoctorsList = () => {
  const { adminBackendUrl, adminToken, currencySymbol } = useContext(AppContext)
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState('')

  const fetchDoctors = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(adminBackendUrl + '/all-doctors', {
        headers: { token: adminToken }
      })

      if (data.success) {
        setDoctors(data.doctors)
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDoctors()
  }, [])

  const deleteDoctor = async (doctorId, doctorName) => {
    const shouldDelete = window.confirm(`Remove ${doctorName} from the database?`)

    if (!shouldDelete) {
      return
    }

    try {
      setDeletingId(doctorId)
      const { data } = await axios.delete(adminBackendUrl + `/delete-doctor/${doctorId}`, {
        headers: { token: adminToken }
      })

      if (data.success) {
        toast.success(data.message)
        setDoctors((prev) => prev.filter((doctor) => doctor._id !== doctorId))
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      toast.error(err.message)
    } finally {
      setDeletingId('')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Doctors List</h1>
        <p className="mt-1 text-sm text-zinc-500">Doctors saved in the database.</p>
      </div>

      <div className="rounded border bg-white shadow-sm">
        {loading ? (
          <p className="p-5 text-sm text-zinc-500">Loading doctors...</p>
        ) : doctors.length === 0 ? (
          <p className="p-5 text-sm text-zinc-500">No doctors found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left text-sm">
              <thead className="border-b bg-zinc-50 text-xs uppercase text-zinc-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Doctor</th>
                  <th className="px-4 py-3 font-medium">Speciality</th>
                  <th className="px-4 py-3 font-medium">Experience</th>
                  <th className="px-4 py-3 font-medium">Fees</th>
                  <th className="px-4 py-3 font-medium">Address</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {doctors.map((doctor) => (
                  <tr key={doctor._id} className="align-top">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <img src={doctor.image} alt={doctor.name} className="h-14 w-14 rounded object-cover bg-zinc-100" />
                        <div>
                          <p className="font-medium text-zinc-900">{doctor.name}</p>
                          <p className="text-xs text-zinc-500">{doctor.email}</p>
                          <p className="text-xs text-zinc-500">{doctor.degree}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-zinc-600">{doctor.speciality}</td>
                    <td className="px-4 py-4 text-zinc-600">{doctor.experience}</td>
                    <td className="px-4 py-4 text-zinc-600">{currencySymbol}{doctor.fees}</td>
                    <td className="px-4 py-4 text-zinc-600">
                      <p>{doctor.address?.line1}</p>
                      <p>{doctor.address?.line2}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${doctor.available ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {doctor.available ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => deleteDoctor(doctor._id, doctor.name)}
                        disabled={deletingId === doctor._id}
                        className="rounded border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {deletingId === doctor._id ? 'Removing...' : 'Remove'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default DoctorsList
