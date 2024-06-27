import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card'
import { validateEmail } from './utils/login'
import { signIn, signUp } from '../../services/authService'
import { useSession } from '../../contexts/SessionContext'
import { useNavigate } from 'react-router-dom'

export function LoginForm() {
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const { updateSession } = useSession()
  const navigate = useNavigate()

  const handleSignIn = async (e) => {
    e.preventDefault()
    const payload = validateEmail(userName)
      ? { email: userName, password: password }
      : { userName: userName, password: password }

    try {
      const res = await signIn(payload)
      updateSession(res.data)
      navigate('/home')
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
    <Card>
      <Card.Body>
        <Card.Title>Sign In</Card.Title>
        <Form>
          <Form.Group controlId="email">
            <Form.Label>Username or Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter Username"
              value={userName}
              onChange={handleUserNameChange}
            />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
            />
          </Form.Group>
          <br />
          <Button variant="primary" onClick={handleSignIn}>
            Submit
          </Button>
        </Form>
      </Card.Body>
    </Card>
  )
}

export function SignUpForm({ toggleSignUp }) {
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
    <Card>
      <Card.Body>
        <Card.Title>Sign Up</Card.Title>
        <Form>
          <Form.Group controlId="email">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your Email Address"
              value={email}
              onChange={handleEmailChange}
            />
          </Form.Group>
          <Form.Group controlId="userName">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Select a username"
              value={userName}
              onChange={handleUserNameChange}
            />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
            />
          </Form.Group>
          <Form.Group controlId="firstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={handleFirstNameChange}
            />
          </Form.Group>
          <Form.Group controlId="lastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={handleLastNameChange}
            />
          </Form.Group>
          <br />
          <Button variant="primary" onClick={handleSignUp}>
            Submit
          </Button>
        </Form>
      </Card.Body>
    </Card>
  )
}
