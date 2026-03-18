import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Landing.css'

// Render a sequence of adjacent rectangles at the top-right.
function generateColors(count) {
  const vars = ['var(--c1)', 'var(--c2)', 'var(--c3)', 'var(--c4)', 'var(--c5)']
  const out = []
  for (let i = 0; i < count; i++) {
    let choice
    do {
      choice = vars[Math.floor(Math.random() * vars.length)]
    } while (choice === out[i - 1])
    out.push(choice)
  }
  return out
}

function generateRects(count) {
  const out = []
  const types = []
  for (let i = 0; i < count; i++) {
    let t
    let attempts = 0
    do {
      const r = Math.random()
      if (r < 0.5) t = 'medium'
      else if (r < 0.75) t = 'short'
      else t = 'large'
      attempts++
      if (attempts > 10) t = 'medium'
    } while ((types[i - 1] === 'short' && t === 'short') || (types[i - 1] === 'large' && t === 'large'))

    types.push(t)

    let h, arcMult, afterMult, afterHeightMult, afterBottom
    if (t === 'short') {
      h = 72 + Math.random() * 14
      arcMult = 0.35 + Math.random() * 0.15
      afterMult = 0.6 + Math.random() * 0.25
      afterHeightMult = 0.12 + Math.random() * 0.07
      afterBottom = 8 + Math.random() * 8
    } else if (t === 'medium') {
      h = 96 + Math.random() * 24
      arcMult = 0.5 + Math.random() * 0.25
      afterMult = 0.8 + Math.random() * 0.3
      afterHeightMult = 0.16 + Math.random() * 0.12
      afterBottom = 12 + Math.random() * 12
    } else {
      h = 120 + Math.random() * 60
      arcMult = 0.75 + Math.random() * 0.5
      afterMult = 1.0 + Math.random() * 0.6
      afterHeightMult = 0.28 + Math.random() * 0.2
      afterBottom = 20 + Math.random() * 28
    }

    out.push({ h, arcMult, afterMult, afterHeightMult, afterBottom, z: Math.round(h) })
  }
  return out
}

function getRectWidth(windowWidth) {
  if (windowWidth <= 520) return 96
  if (windowWidth <= 900) return 120
  return 140
}

function getCount(windowWidth) {
  return Math.ceil(windowWidth / getRectWidth(windowWidth)) + 1
}

const MAX_RECTS = 60

export default function Landing() {
  const colors = React.useMemo(() => generateColors(MAX_RECTS), [])
  const rects = React.useMemo(() => generateRects(MAX_RECTS), [])
  const [count, setCount] = useState(() => getCount(window.innerWidth))
  const navigate = useNavigate()
  const { login } = useAuth()


  useEffect(() => {
    const update = () => setCount(getCount(window.innerWidth))
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    if (!username || !password) return
    login(username)
    navigate('/archive')
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleLogin(e)
  }

  return (
    <div className="landing">
      <div className="rect-container" aria-hidden>
        {colors.slice(0, count).map((c, i) => {
          const r = rects[i]
          return (
            <div
              key={i}
              className="rect"
              style={{
                background: c,
                '--h': `${r.h}%`,
                '--arc-mult': r.arcMult,
                '--after-mult': r.afterMult,
                '--after-height-mult': r.afterHeightMult,
                '--after-bottom': `${r.afterBottom}px`,
                zIndex: r.z,
              }}
            />
          )
        })}
      </div>

      <div className="center-form" role="form" aria-label="Login form">
        <h1 className="landing-title">backstory</h1>
        <label className="sr-only" htmlFor="username">Username</label>
        <input
          id="username"
          className="input-box"
          placeholder="Username"
          aria-label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyPress={handleKeyPress}
        />

        <label className="sr-only" htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          className="input-box"
          placeholder="Password"
          aria-label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
        />

        {/* Role toggle */}

        <button
          className="login-btn"
          onClick={handleLogin}
          disabled={!username || !password}
        >
          Login
        </button>
      </div>
    </div>
  )
}
