import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Landing from './routes/landing/landing'
import Home from './routes/home/home'
import { ChatRoom } from './routes/chat/chatroom'
import AuthProvider from './contexts/AuthProvider'
import PrivateRoute from './routes/common/private'

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
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  )
}

export default App
