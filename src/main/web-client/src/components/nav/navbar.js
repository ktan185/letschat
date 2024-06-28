import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import { useAuth } from '../../contexts/AuthProvider'
import styles from './nav.module.css'
import { Button, Nav } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

function NavBar() {
  const auth = useAuth()
  const user = auth.getUserDetails()
  const navigate = useNavigate()

  return (
    <div className={styles.container}>
      <Navbar bg="dark" data-bs-theme="dark" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand
            onClick={() => {
              navigate('/home')
            }}
          >
            <img
              className={styles.logo}
              src="/chat.png"
              alt="Let's Chat logo"
            />
            Let's Chat!
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-start">
            <Navbar.Text>{`Welcome back, ${user.firstName}!`}</Navbar.Text>
          </Navbar.Collapse>
          <Nav>
            <Nav.Link
              onClick={() => {
                navigate('/me')
              }}
            >
              My Profile
            </Nav.Link>
          </Nav>

          <Button className={styles.signOut} onClick={() => auth.logOut()}>
            Sign out
          </Button>
        </Container>
      </Navbar>
    </div>
  )
}

export default NavBar
