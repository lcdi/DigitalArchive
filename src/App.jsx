import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Landing from './pages/Landing/Landing'
import ArchivePage from './pages/ArchivePage/ArchivePage'

function ProtectedRoute({ children }) {
    const { user } = useAuth()
    if (!user) return <Navigate to="/" replace />
    return children
}

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route
                path="/archive"
                element={
                    <ProtectedRoute>
                        <ArchivePage />
                    </ProtectedRoute>
                }
            />
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