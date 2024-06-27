import React from 'react'
import { createContext, useState, useContext } from 'react'

const SessionContext = createContext()

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState({})

  const updateSession = (newSession) => {
    setSession(newSession)
  }

  return (
    <SessionContext.Provider value={{ session, updateSession }}>
      {children}
    </SessionContext.Provider>
  )
}

export const useSession = () => {
  return useContext(SessionContext)
}

export function isLoggedIn(obj) {
  return !(Object.keys(obj).length === 0 && obj.constructor === Object)
}
