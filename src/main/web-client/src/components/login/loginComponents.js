import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card'

function LoginForm() {
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')

  const handleSignIn = (e) => {
    e.preventDefault()
    // Api call placeholder
    console.log({ userName, password })
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

export default LoginForm
