import React from 'react'

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-500">Manage doctors and appointments from the admin panel.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded border bg-white p-5 shadow-sm">
          <p className="text-sm text-zinc-500">Doctors</p>
          <p className="mt-2 text-3xl font-semibold">--</p>
        </div>
        <div className="rounded border bg-white p-5 shadow-sm">
          <p className="text-sm text-zinc-500">Appointments</p>
          <p className="mt-2 text-3xl font-semibold">--</p>
        </div>
        <div className="rounded border bg-white p-5 shadow-sm">
          <p className="text-sm text-zinc-500">Patients</p>
          <p className="mt-2 text-3xl font-semibold">--</p>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
