import React, { useContext, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const initialForm = {
  name: '',
  email: '',
  password: '',
  speciality: 'General physician',
  degree: '',
  experience: '',
  fees: '',
  about: '',
  line1: '',
  line2: ''
}

const AddDoctor = () => {
  const { adminBackendUrl, adminToken } = useContext(AppContext)
  const [form, setForm] = useState(initialForm)
  const [image, setImage] = useState(false)
  const [loading, setLoading] = useState(false)

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const submitHandler = async (e) => {
    e.preventDefault()

    if (!image) {
      toast.error('Doctor image required')
      return
    }

    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('image', image)
      formData.append('name', form.name)
      formData.append('email', form.email)
      formData.append('password', form.password)
      formData.append('speciality', form.speciality)
      formData.append('degree', form.degree)
      formData.append('experience', form.experience)
      formData.append('fees', form.fees)
      formData.append('about', form.about)
      formData.append('address', JSON.stringify({ line1: form.line1, line2: form.line2 }))

      const { data } = await axios.post(adminBackendUrl + '/add-doctor', formData, {
        headers: { token: adminToken }
      })

      if (data.success) {
        toast.success(data.message)
        setForm(initialForm)
        setImage(false)
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submitHandler} className="max-w-5xl rounded border bg-white p-5 shadow-sm">
      <h1 className="text-2xl font-semibold text-zinc-900">Add Doctor</h1>

      <div className="mt-6 flex flex-col gap-6">
        <label className="flex w-fit cursor-pointer items-center gap-4">
          <img
            src={image ? URL.createObjectURL(image) : assets.upload_area}
            alt="Upload"
            className="h-24 w-24 rounded border object-cover"
          />
          <span className="text-sm text-zinc-500">Upload doctor picture</span>
          <input type="file" accept="image/*" hidden onChange={(e) => setImage(e.target.files[0])} />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <input className="rounded border px-3 py-2" placeholder="Doctor name" value={form.name} onChange={(e) => updateField('name', e.target.value)} required />
          <input className="rounded border px-3 py-2" placeholder="Doctor email" value={form.email} onChange={(e) => updateField('email', e.target.value)} required />
          <input className="rounded border px-3 py-2" placeholder="Password" type="password" value={form.password} onChange={(e) => updateField('password', e.target.value)} required />
          <select className="rounded border px-3 py-2" value={form.speciality} onChange={(e) => updateField('speciality', e.target.value)}>
            <option>General physician</option>
            <option>Gynecologist</option>
            <option>Dermatologist</option>
            <option>Pediatricians</option>
            <option>Neurologist</option>
            <option>Gastroenterologist</option>
          </select>
          <input className="rounded border px-3 py-2" placeholder="Degree" value={form.degree} onChange={(e) => updateField('degree', e.target.value)} required />
          <input className="rounded border px-3 py-2" placeholder="Experience" value={form.experience} onChange={(e) => updateField('experience', e.target.value)} required />
          <input className="rounded border px-3 py-2" placeholder="Fees" type="number" value={form.fees} onChange={(e) => updateField('fees', e.target.value)} required />
          <input className="rounded border px-3 py-2" placeholder="Address line 1" value={form.line1} onChange={(e) => updateField('line1', e.target.value)} required />
          <input className="rounded border px-3 py-2 md:col-span-2" placeholder="Address line 2" value={form.line2} onChange={(e) => updateField('line2', e.target.value)} required />
          <textarea className="min-h-32 rounded border px-3 py-2 md:col-span-2" placeholder="About doctor" value={form.about} onChange={(e) => updateField('about', e.target.value)} required />
        </div>

        <button disabled={loading} className="w-fit rounded bg-amber-400 px-8 py-3 font-medium text-white disabled:opacity-60">
          {loading ? 'Adding...' : 'Add Doctor'}
        </button>
      </div>
    </form>
  )
}

export default AddDoctor
