import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const AdminProtectedRoute = ({ children }) => {
  const { adminToken } = useContext(AppContext)

  if (!adminToken) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

export default AdminProtectedRoute
