import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Landing from './routes/landing/landing'
import Home from './routes/home/home'
import Chat from './routes/chat/chat'
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
              <Route path="/chatroom" element={<Chat />} />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  )
}

export default App
