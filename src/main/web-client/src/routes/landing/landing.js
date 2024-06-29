import { useLocation, useNavigate } from 'react-router-dom'
import { SignInSignUpCard } from '../../components/login/loginComponents'
import styles from './landing.module.css'
import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthProvider'

function Landing() {
  const [isSignUpCard, setSignUp] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const auth = useAuth()

  // If we are on this page, then we have to be signed out.
  useEffect(() => {
    if (location.pathname === '/' && auth.user) {
      navigate('/home')
    }
  })

  const toggleSignUp = () => {
    setSignUp(!isSignUpCard)
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Lets Chat!</h1>
      <div className={styles.signInContainer}>
        <SignInSignUpCard
          isSignUpCard={isSignUpCard}
          toggleSignUp={toggleSignUp}
        />
      </div>
    </div>
  )
}

export default Landing
