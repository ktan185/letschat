import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import { useAuth } from '../../contexts/AuthProvider'
import styles from './nav.module.css'
import { Button } from 'react-bootstrap'

function NavBar() {
  const auth = useAuth()
  const user = auth.getUserDetails()

  return (
    <div className={styles.container}>
      <Navbar bg="dark" data-bs-theme="dark" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="/home">
            <img
              className={styles.logo}
              src="/chat.png"
              alt="Let's Chat logo"
            />
            Let's Chat!
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            {user ? (
              <>
                <Navbar.Text>{`Welcome back, ${user.firstName}!`}</Navbar.Text>
                <Button
                  className={styles.signOut}
                  onClick={() => auth.logOut()}
                >
                  Sign out
                </Button>
              </>
            ) : (
              <Navbar.Text>{`Sign in to get chatting!`}</Navbar.Text>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  )
}

export default NavBar
