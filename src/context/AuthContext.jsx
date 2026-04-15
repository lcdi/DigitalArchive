import { createContext, useContext, useState, useEffect } from 'react'
import { api, setToken, clearToken } from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On mount, restore session from localStorage if a token exists
  useEffect(() => {
    const token = localStorage.getItem('session_token')
    if (!token) {
      setLoading(false)
      return
    }
    api.get('/users/me')
      .then((u) => setUser({ ...u, provider: 'google' }))
      .catch(() => clearToken())          // token expired or invalid — discard it
      .finally(() => setLoading(false))
  }, [])

  // Legacy username/password login (kept for dev convenience until fully migrated)
  const login = (username) => {
    setUser({ username, role: 'admin', provider: 'local' })
  }

  // Google OAuth login — sends the credential to the API for server-side verification
  const loginWithGoogle = async (credentialResponse) => {
    const { token, user: profile } = await api.post('/auth/google', {
      credential: credentialResponse.credential,
    })
    setToken(token)
    setUser({ ...profile, provider: 'google' })
  }

  const logout = () => {
    clearToken()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

export function usePermissions() {
  const { user } = useAuth()
  const isAdmin = user !== null && user !== undefined

  return {
    isAdmin,
    canAddArtifacts:         isAdmin,
    canEditArtifacts:        isAdmin,
    canDeleteArtifacts:      isAdmin,
    canCreateCollections:    isAdmin,
    canViewPrivateArchives:  isAdmin,
    canViewPrivateArtifacts: isAdmin,
    canViewPrivateDetails:   isAdmin,
    canViewPseudonymContext: isAdmin,
  }
}
