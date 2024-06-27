import Button from 'react-bootstrap/esm/Button'
import { SignUpForm, LoginForm } from '../../components/login/loginComponents'
import styles from './landing.module.css'
import { useState } from 'react'

function Landing() {
  const [isSignUpCard, setSignUp] = useState(false)

  const toggleSignUp = (e) => {
    setSignUp(!isSignUpCard)
  }

  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <h1 className={styles.title}>Lets Chat!</h1>
        <div className={styles.signInContainer}>
          {isSignUpCard ? (
            <>
              <SignUpForm />
              <a>Have an account? </a>
            </>
          ) : (
            <>
              <LoginForm />
              <a>Don't have an account? </a>
            </>
          )}
          <Button onClick={toggleSignUp}>
            {isSignUpCard ? 'Sign In' : 'Sign Up now!'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Landing
