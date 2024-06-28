import { useContext, createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { signIn } from '../services/authService'

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  // Default to check if there is no user signed in is if user === null
  const [user, setUser] = useState(localStorage.getItem('user' || null))
  const navigate = useNavigate()

  const loginAction = async (data) => {
    try {
      const res = await signIn(data)
      if (res.data) {
        setUser(res.data)
        localStorage.setItem('user', JSON.stringify(res.data))
        navigate('/home')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const logOut = () => {
    setUser(null)
    localStorage.removeItem('user')
    navigate('/')
  }

  const getUserDetails = () => {
    return JSON.parse(localStorage.getItem('user'))
  }

  return (
    <AuthContext.Provider value={{ user, loginAction, logOut, getUserDetails }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider

export const useAuth = () => {
  return useContext(AuthContext)
}
