import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthProvider'
import NavBar from '../../components/nav/navbar'

const PrivateRoute = () => {
  const auth = useAuth()
  if (!auth.user) return <Navigate to="/" />
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  )
}

export default PrivateRoute
