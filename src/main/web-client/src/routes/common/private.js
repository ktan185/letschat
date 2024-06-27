import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthProvider'

const PrivateRoute = () => {
  const auth = useAuth()
  if (!auth.user) return <Navigate to="/" />
  return <Outlet />
}

export default PrivateRoute
