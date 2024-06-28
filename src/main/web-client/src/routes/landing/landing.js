import { SignInSignUpCard } from '../../components/login/loginComponents'
import styles from './landing.module.css'
import { useState } from 'react'

function Landing() {
  const [isSignUpCard, setSignUp] = useState(false)

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
