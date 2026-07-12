import React, { useState, useContext } from 'react'
import { assets_frontend } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const MyProfile = () => {
  const [isEdit, setIsEdit] = useState(false)
  const [image, setImage] = useState(false)
  const { userData, setUserData, token, backendUrl, loadUserData } = useContext(AppContext)

  if (!userData) {
    return (
      <div className="page-wrapper flex items-center justify-center py-24">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
      </div>
    )
  }

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData()
      formData.append('name', userData.name)
      formData.append('phone', userData.phone)
      formData.append('address', JSON.stringify(userData.address))
      formData.append('gender', userData.gender)
      formData.append('dob', userData.dob)
      if (image) formData.append('image', image)

      const { data } = await axios.post(backendUrl + '/update-profile', formData, { headers: { token } })
      if (data.success) { toast.success(data.message); await loadUserData(); setIsEdit(false); setImage(false) }
      else toast.error(data.message)
    } catch (err) { toast.error(err.message) }
  }

  const Field = ({ label, children }) => (
    <div className="flex flex-col gap-1">
      <span className="form-label">{label}</span>
      {children}
    </div>
  )

  return (
    <div className="page-wrapper fade-up">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
            <p className="text-sm text-slate-400 mt-0.5">Manage your personal information</p>
          </div>
          <button
            onClick={() => isEdit ? updateUserProfileData() : setIsEdit(true)}
            className={isEdit ? 'btn-primary px-6 py-2.5 text-sm' : 'btn-outline px-6 py-2.5 text-sm'}
          >
            {isEdit ? '✓ Save Changes' : '✎ Edit Profile'}
          </button>
        </div>

        <div className="bg-white border border-blue-100 rounded-2xl shadow-sm overflow-hidden">
          {/* Cover / Avatar */}
          <div className="h-24 bg-gradient-to-br from-blue-100 to-blue-200" />
          <div className="px-6 pb-6">
            <div className="flex items-end gap-4 -mt-12 mb-6">
              {isEdit ? (
                <label htmlFor="image" className="cursor-pointer group">
                  <div className="relative">
                    <img
                      className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md"
                      src={image ? URL.createObjectURL(image) : userData.image}
                      alt="Profile"
                    />
                    <div className="absolute inset-0 rounded-2xl bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </div>
                  <input id="image" type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} hidden />
                </label>
              ) : (
                <img className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md" src={userData.image} alt="Profile" />
              )}
              <div className="mb-1">
                {isEdit ? (
                  <input
                    className="input-field text-lg font-semibold py-1.5 w-48"
                    value={userData.name}
                    onChange={e => setUserData(p => ({ ...p, name: e.target.value }))}
                  />
                ) : (
                  <p className="text-xl font-bold text-slate-800">{userData.name}</p>
                )}
                <p className="text-sm text-slate-400 mt-0.5">{userData.email}</p>
              </div>
            </div>

            <div className="divider" />

            {/* Contact Info */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Email">
                  <p className="text-sm text-blue-600 font-medium py-1.5">{userData.email}</p>
                </Field>
                <Field label="Phone">
                  {isEdit
                    ? <input className="input-field text-sm" type="tel" value={userData.phone} onChange={e => setUserData(p => ({ ...p, phone: e.target.value }))} />
                    : <p className="text-sm text-slate-700 py-1.5">{userData.phone || '—'}</p>}
                </Field>
                <Field label="Address Line 1">
                  {isEdit
                    ? <input className="input-field text-sm" type="text" placeholder="Line 1" value={userData.address?.line1 || ''} onChange={e => setUserData(p => ({ ...p, address: { ...p.address, line1: e.target.value } }))} />
                    : <p className="text-sm text-slate-700 py-1.5">{userData.address?.line1 || '—'}</p>}
                </Field>
                <Field label="Address Line 2">
                  {isEdit
                    ? <input className="input-field text-sm" type="text" placeholder="Line 2" value={userData.address?.line2 || ''} onChange={e => setUserData(p => ({ ...p, address: { ...p.address, line2: e.target.value } }))} />
                    : <p className="text-sm text-slate-700 py-1.5">{userData.address?.line2 || '—'}</p>}
                </Field>
              </div>
            </div>

            <div className="divider" />

            {/* Basic Info */}
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Gender">
                  {isEdit
                    ? (
                      <select className="input-field text-sm" value={userData.gender} onChange={e => setUserData(p => ({ ...p, gender: e.target.value }))}>
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    )
                    : <p className="text-sm text-slate-700 py-1.5 capitalize">{userData.gender || '—'}</p>}
                </Field>
                <Field label="Date of Birth">
                  {isEdit
                    ? <input className="input-field text-sm" type="date" value={userData.dob} onChange={e => setUserData(p => ({ ...p, dob: e.target.value }))} />
                    : <p className="text-sm text-slate-700 py-1.5">{userData.dob || '—'}</p>}
                </Field>
              </div>
            </div>

            {/* Mobile save/cancel */}
            {isEdit && (
              <div className="flex gap-3 mt-6 sm:hidden">
                <button onClick={updateUserProfileData} className="btn-primary flex-1 py-3 text-sm">Save Changes</button>
                <button onClick={() => { setIsEdit(false); setImage(false) }} className="btn-outline flex-1 py-3 text-sm">Cancel</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyProfile