import LoginForm from '../../components/login/loginComponents'
import styles from './landing.module.css'

function Landing() {
  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <h1 className={styles.title}>Lets Chat!</h1>
        <div className={styles.signInContainer}>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}

export default Landing
