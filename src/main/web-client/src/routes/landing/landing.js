import Button from 'react-bootstrap/esm/Button'
import { SignInSignUpCard } from '../../components/login/loginComponents'
import styles from './landing.module.css'
import { useState } from 'react'

function Landing() {
  const [isSignUpCard, setSignUp] = useState(false)

  const toggleSignUp = () => {
    setSignUp(!isSignUpCard)
  }

  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <h1 className={styles.title}>Lets Chat!</h1>
        <div className={styles.signInContainer}>
          <SignInSignUpCard
            isSignUpCard={isSignUpCard}
            toggleSignUp={toggleSignUp}
          />
          <Button onClick={toggleSignUp}>
            {isSignUpCard ? 'Sign In' : 'Sign Up now!'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Landing
