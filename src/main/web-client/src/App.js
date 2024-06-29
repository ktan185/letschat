import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Landing from './routes/landing/landing'
import Home from './routes/home/home'
import { ChatRoom } from './routes/chatroom/chatroom'
import AuthProvider from './contexts/AuthProvider'
import PrivateRoute from './routes/common/private'
import NavBar from './components/nav/navbar'
import Profile from './routes/profile/profile'

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route element={<PrivateRoute />}>
              <Route path="/home" element={<Home />} />
              <Route path="/chatroom" element={<ChatRoom />} />
              <Route path="/me" element={<Profile />} />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  )
}

export default App
