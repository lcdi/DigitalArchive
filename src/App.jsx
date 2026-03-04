import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Landing from './pages/Landing/Landing'
import ArchivePage from './pages/ArchivePage/ArchivePage'
import ViewPage from './pages/ViewPage/ViewPage'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      {/* Login */}
      <Route path="/" element={<Landing />} />

      {/* Admin archive — requires login */}
      <Route
        path="/archive"
        element={
          <ProtectedRoute>
            <ArchivePage />
          </ProtectedRoute>
        }
      />

      {/* Public share link — no login needed */}
      {/* Private collections show an Access Denied page to unauthenticated users */}
      <Route path="/view/:collectionId" element={<ViewPage />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  )
}

export default App
