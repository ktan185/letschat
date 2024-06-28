import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card'
import { validateEmail } from './utils/login'
import { signUp } from '../../services/authService'
import { useAuth } from '../../contexts/AuthProvider'
import styles from './login.module.css'

export function SignInSignUpCard({ isSignUpCard, toggleSignUp }) {
  const [showCard, setShowCard] = useState(isSignUpCard)
  const [animateClass, setAnimateClass] = useState(styles.fadeIn)

  useEffect(() => {
    setAnimateClass(styles.fadeOut)
    const timeoutId = setTimeout(() => {
      setShowCard(isSignUpCard)
      setAnimateClass(styles.fadeIn)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [isSignUpCard])

  return (
    <div className={`${styles.cardContainer} ${animateClass}`}>
      {showCard ? (
        <SignUpForm toggleSignUp={toggleSignUp} />
      ) : (
        <LoginForm toggleSignUp={toggleSignUp} />
      )}
    </div>
  )
}

function LoginForm({ toggleSignUp }) {
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const auth = useAuth()

  const handleSignIn = async (e) => {
    e.preventDefault()
    const payload = validateEmail(userName)
      ? { email: userName, password: password }
      : { userName: userName, password: password }

    try {
      // call login API to attempt to sign in
      auth.loginAction(payload)
    } catch (err) {
      alert('The login details you provided are incorrect!')
    }
  }

  const handleUserNameChange = (e) => {
    setUserName(e.target.value)
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  }

  return (
    <Card className={styles.card}>
      <Card.Body>
        <Card.Title>Sign In</Card.Title>
        <Form>
          <Form.Group className="mb-2" controlId="email">
            <Form.Label>Username or Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter Username"
              value={userName}
              onChange={handleUserNameChange}
            />
          </Form.Group>
          <Form.Group className="mb-2" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
            />
          </Form.Group>
          <div className={styles.submitButtonContainer}>
            <Button variant="primary" onClick={handleSignIn}>
              Sign In
            </Button>
          </div>
        </Form>
        <div className={styles.buttonContainer}>
          <p>Don't have an account?</p>
          <Button variant="link" onClick={toggleSignUp}>
            Sign Up
          </Button>
        </div>
      </Card.Body>
    </Card>
  )
}

function SignUpForm({ toggleSignUp }) {
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
  }

  const handleUserNameChange = (e) => {
    setUserName(e.target.value)
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  }

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value)
  }
  const handleLastNameChange = (e) => {
    setLastName(e.target.value)
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    const newUser = {
      email: email,
      userName: userName,
      password: password,
      firstName: firstName,
      lastName: lastName,
    }

    // We will add some frontend form checking logic here later.

    try {
      await signUp(newUser)
      alert('you have successfully signed up!')
      toggleSignUp()
    } catch (err) {
      if (err.response.status === 409) {
        alert('The Username or Email has already been taken!')
      } else if (err.response.status === 406) {
        alert('Please do not leave any fields blank!')
      }
    }
  }

  return (
    <Card className={styles.card}>
      <Card.Body>
        <Card.Title>Sign Up</Card.Title>
        <Form>
          <Form.Group className="mb-2" controlId="email">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="E.g. johnsmith@gmail.com"
              value={email}
              onChange={handleEmailChange}
            />
          </Form.Group>
          <div className={styles.inputContainer}>
            <Form.Group className="mb-2" controlId="userName">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="E.g. johnsmith123"
                value={userName}
                onChange={handleUserNameChange}
              />
            </Form.Group>
            <Form.Group className="mb-2" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                required
                type="password"
                placeholder="######"
                value={password}
                onChange={handlePasswordChange}
              />
            </Form.Group>
          </div>
          <div className={styles.inputContainer}>
            <Form.Group className="mb-2" controlId="firstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="E.g. John"
                value={firstName}
                onChange={handleFirstNameChange}
              />
            </Form.Group>
            <Form.Group className="mb-2" controlId="lastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="E.g. Smith"
                value={lastName}
                onChange={handleLastNameChange}
              />
            </Form.Group>
          </div>
          <div className={styles.submitButtonContainer}>
            <Button variant="primary" onClick={handleSignUp}>
              Create Account!
            </Button>
          </div>
        </Form>
        <div className={styles.buttonContainer}>
          <p>Have an account?</p>
          <Button variant="link" onClick={toggleSignUp}>
            Sign In
          </Button>
        </div>
      </Card.Body>
    </Card>
  )
}
