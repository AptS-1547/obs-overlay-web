import { Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Ticker from './components/Ticker'
import StatusBar from './components/StatusBar'
import MessageBox from './components/MessageBox'
import StreamProgress from './components/StreamProgress'
import ClockDisplay from './components/ClockDisplay'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/ticker" element={<Ticker />} />
      <Route path="/statusbar" element={<StatusBar />} />
      <Route path="/message" element={<MessageBox />} />
      <Route path="/progress" element={<StreamProgress />} />
      <Route path="/clock" element={<ClockDisplay />} />
    </Routes>
  )
}

export default App
