import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  // Any valid login = admin. No role selection.
  const login = (username) => {
    setUser({ username, role: 'admin' })
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

export function usePermissions() {
  const { user } = useAuth()
  // Logged-in = admin. Logged-out = read-only public viewer.
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

