import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import VideoPlayer from './pages/VideoPlayer'
import Login from './pages/Login'
import Register from './pages/Register'
import ChannelPage from './pages/ChannelPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/video/:id" element={<VideoPlayer />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/channel" element={<ChannelPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App