import { useContext, createContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signIn } from '../services/authService'

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  // Default to check if there is no user signed in is if user === null
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('site' || ''))
  const navigate = useNavigate()
  const loginAction = async (data) => {
    try {
      const res = await signIn(data)
      if (res.data) {
        setUser(res.data)
        setToken(res.data.token)
        localStorage.setItem('site', res.data.token)
        navigate('/home')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const logOut = () => {
    setUser(null)
    setToken('')
    localStorage.removeItem('Site')
    navigate('/')
  }

  return (
    <AuthContext.Provider value={{ token, user, loginAction, logOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider

export const useAuth = () => {
  return useContext(AuthContext)
}
