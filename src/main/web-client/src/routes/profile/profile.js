import Card from 'react-bootstrap/Card'
import styles from './profile.module.css'
import { useAuth } from '../../contexts/AuthProvider'

export default function Profile() {
  const auth = useAuth()
  const user = auth.getUserDetails()

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <Card className={styles.pfp}>
          <Card.Img variant="top" src="avatar.jpg" />
        </Card>
        <Card className={styles.userInfo}>
          <Card.Body>
            <Card.Title>{`${user.firstName} ${user.lastName}`}</Card.Title>
            <Card.Text>Description of the user:</Card.Text>
          </Card.Body>
        </Card>
      </Card>
    </div>
  )
}
