import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './SiteHeader.css'

export default function SiteHeader() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="site-header">
      {/* Logo / brand — always links back to landing */}
      <button
        className="site-logo-btn"
        onClick={() => navigate('/')}
        aria-label="Backstory home"
      >
        <span className="site-logo-icon" aria-hidden>B</span>
        <span className="site-logo-text">
          <span className="site-logo-name">backstory</span>
          <span className="site-logo-sub">Leahy Center · Champlain College</span>
        </span>
      </button>

      {/* Auth controls */}
      <div className="site-header-auth">
        {user ? (
          <>
            <span className="site-user-badge" aria-label={`Signed in as ${user.username}`}>
              {user.picture ? (
                <img
                  className="site-user-avatar"
                  src={user.picture}
                  alt=""
                  aria-hidden
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="site-user-icon" aria-hidden>✏️</span>
              )}
              {user.username}
            </span>
            <button className="site-signout-btn" onClick={handleLogout}>
              Sign Out
            </button>
          </>
        ) : (
          <button className="site-signin-btn" onClick={() => navigate('/')}>
            Sign In
          </button>
        )}
      </div>
    </header>
  )
}
