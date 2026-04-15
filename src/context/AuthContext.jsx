import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

// Decode the JWT payload Google returns — frontend only, not for security verification.
function decodeGoogleJwt(token) {
  const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
  return JSON.parse(atob(base64))
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  // Legacy username/password login (any username = admin)
  const login = (username) => {
    setUser({ username, role: 'admin', provider: 'local' })
  }

  // Google OAuth login — credentialResponse comes from @react-oauth/google
  const loginWithGoogle = (credentialResponse) => {
    const profile = decodeGoogleJwt(credentialResponse.credential)
    setUser({
      username:  profile.name,
      email:     profile.email,
      picture:   profile.picture,
      googleId:  profile.sub,
      role:      'admin',
      provider:  'google',
    })
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, logout }}>
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
