import { Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Ticker from './components/Ticker'
import StatusBar from './components/StatusBar'
import MessageBox from './components/MessageBox'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/ticker" element={<Ticker />} />
      <Route path="/statusbar" element={<StatusBar />} />
      <Route path="/message" element={<MessageBox />} />
    </Routes>
  )
}

export default App
