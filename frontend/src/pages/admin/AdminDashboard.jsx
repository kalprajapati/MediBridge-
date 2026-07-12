import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../../context/AppContext'

const StatCard = ({ label, value, icon, color }) => (
  <div className={`rounded border bg-white p-5 shadow-sm flex items-center gap-4`}>
    <div className={`text-3xl ${color}`}>{icon}</div>
    <div>
      <p className="text-sm text-zinc-500">{label}</p>
      {value === null
        ? <div className="mt-2 h-8 w-16 animate-pulse rounded bg-zinc-200" />
        : <p className="mt-1 text-3xl font-semibold text-zinc-900">{value}</p>
      }
    </div>
  </div>
)

const AdminDashboard = () => {
  const { adminBackendUrl, adminToken } = useContext(AppContext)
  const [stats, setStats] = useState(null)
  const [recentAppointments, setRecentAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchStats = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(adminBackendUrl + '/dashboard', {
        headers: { token: adminToken }
      })

      if (data.success) {
        setStats(data.stats)
        setRecentAppointments(data.recentAppointments || [])
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
    fetchStats()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-500">Overview of your platform at a glance.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Doctors"
          value={loading ? null : stats?.totalDoctors ?? 0}
          icon="🩺"
          color="text-blue-500"
        />
        <StatCard
          label="Total Appointments"
          value={loading ? null : stats?.totalAppointments ?? 0}
          icon="📅"
          color="text-amber-500"
        />
        <StatCard
          label="Total Patients"
          value={loading ? null : stats?.totalPatients ?? 0}
          icon="👥"
          color="text-green-500"
        />
      </div>

      {/* Recent Appointments */}
      <div className="rounded border bg-white shadow-sm">
        <div className="border-b px-5 py-4">
          <h2 className="font-semibold text-zinc-800">Recent Appointments</h2>
          <p className="text-xs text-zinc-500 mt-0.5">Last 5 appointments across all doctors</p>
        </div>

        {loading ? (
          <p className="p-5 text-sm text-zinc-400">Loading...</p>
        ) : recentAppointments.length === 0 ? (
          <p className="p-5 text-sm text-zinc-400">No appointments yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead className="border-b bg-zinc-50 text-xs uppercase text-zinc-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Patient</th>
                  <th className="px-4 py-3 font-medium">Doctor</th>
                  <th className="px-4 py-3 font-medium">Date &amp; Time</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {recentAppointments.map((appt) => (
                  <tr key={appt._id} className="align-middle">
                    <td className="px-4 py-3 text-zinc-700">{appt.userData?.name || '—'}</td>
                    <td className="px-4 py-3 text-zinc-700">{appt.docData?.name || '—'}</td>
                    <td className="px-4 py-3 text-zinc-500">{appt.slotDate} | {appt.slotTime}</td>
                    <td className="px-4 py-3 text-zinc-700">₹{appt.amount}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        appt.cancelled
                          ? 'bg-red-50 text-red-600'
                          : appt.isCompleted
                          ? 'bg-green-50 text-green-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {appt.cancelled ? 'Cancelled' : appt.isCompleted ? 'Completed' : 'Upcoming'}
                      </span>
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

export default AdminDashboard
