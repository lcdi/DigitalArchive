import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const login = (username, role) => {
    setUser({ username, role }) // role: 'admin' | 'viewer'
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

/**
 * Returns a flat set of boolean permission flags derived from the user's role.
 * Use this throughout the app instead of checking role === 'admin' directly.
 */
export function usePermissions() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  return {
    isAdmin,
    isViewer: !isAdmin,

    // UI controls
    canAddArtifacts:       isAdmin,
    canEditArtifacts:      isAdmin,
    canDeleteArtifacts:    isAdmin,
    canCreateCollections:  isAdmin,

    // Data visibility
    canViewPrivateArtifacts: isAdmin,  // artifacts with publicAccess: false
    canViewPrivateDetails:   isAdmin,  // IRB #s, consent form metadata, privacy notes
    canViewPseudonymContext: isAdmin,  // know that a name IS a pseudonym
  }
}
