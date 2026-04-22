import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Landing from './pages/Landing/Landing'
import ArchivePage from './pages/ArchivePage/ArchivePage'
import ViewPage from './pages/ViewPage/ViewPage'
import SiteHeader from './components/SiteHeader'
import SiteFooter from './components/SiteFooter'
import './App.css'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  // Wait for session restoration from localStorage before deciding to redirect
  if (loading) return null
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
        <div className="site-layout">
          <SiteHeader />
          <main className="site-main">
            <AppRoutes />
          </main>
          <SiteFooter />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
