import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing/Landing'
import ArchivePage from './pages/ArchivePage/ArchivePage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/archive" element={<ArchivePage />} />
      </Routes>
    </Router>
  )
}

export default App
