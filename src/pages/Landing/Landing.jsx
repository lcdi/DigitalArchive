import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { artifacts as allArtifacts } from '../../data/artifacts'
import FilterPanel from '../../components/FilterPanel'
import ArtifactCard from '../../components/ArtifactCard'
import DetailPanel from '../../components/DetailPanel'
import { matchesSearch } from '../../utils/searchArtifacts'
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

  const headerRef = useRef(null)
  const rectContainerRef = useRef(null)

  useEffect(() => {
    const update = () => setCount(getCount(window.innerWidth))
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => { document.title = 'Backstory' }, [])

  // Slide rects up as user scrolls — fully off-screen after one viewport height
  useEffect(() => {
    const handleScroll = () => {
      if (!rectContainerRef.current) return
      const offset = Math.min(window.scrollY, window.innerHeight)
      rectContainerRef.current.style.transform = `translateY(-${offset}px)`
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Measure header height and expose as CSS variable for FilterPanel / DetailPanel
  useEffect(() => {
    const header = headerRef.current
    if (!header) return
    const updateHeight = () => {
      const h = header.getBoundingClientRect().bottom
      document.querySelector('.landing')?.style.setProperty('--navbar-height', `${h}px`)
    }
    updateHeight()
    const ro = new ResizeObserver(updateHeight)
    ro.observe(header)
    return () => ro.disconnect()
  }, [])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    if (!username || !password) return
    login(username)
    navigate('/archive')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLogin(e)
  }

  // ── Filter state ──
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedArtifact, setSelectedArtifact] = useState(null)
  const [filters, setFilters] = useState({
    tags: [],
    fileTypes: [],
    uploaders: [],
    dateRange: { start: '', end: '' },
    searchQuery: '',
  })

  // Only show artifacts where publicAccess is not explicitly false
  const publicArtifacts = useMemo(() =>
    allArtifacts.filter(a => a.privacy?.publicAccess !== false),
    []
  )

  const filterOptions = useMemo(() => ({
    tags:      [...new Set(publicArtifacts.flatMap(a => a.tags ?? []))],
    fileTypes: [...new Set(publicArtifacts.map(a => a.fileType).filter(Boolean))],
    uploaders: [...new Set(publicArtifacts.map(a => a.uploader).filter(Boolean))],
  }), [publicArtifacts])

  const filteredArtifacts = useMemo(() => {
    return publicArtifacts.filter(artifact => {
      if (filters.tags.length > 0 && !artifact.tags?.some(t => filters.tags.includes(t))) return false
      if (filters.fileTypes.length > 0 && !filters.fileTypes.includes(artifact.fileType)) return false
      if (filters.uploaders.length > 0 && !filters.uploaders.includes(artifact.uploader)) return false
      if (filters.dateRange.start || filters.dateRange.end) {
        const d = new Date(artifact.uploadDate)
        if (filters.dateRange.start && d < new Date(filters.dateRange.start)) return false
        if (filters.dateRange.end   && d > new Date(filters.dateRange.end))   return false
      }
      if (!matchesSearch(artifact, filters.searchQuery)) return false
      return true
    })
  }, [publicArtifacts, filters])

  const activeFilterCount =
    filters.tags.length + filters.fileTypes.length + filters.uploaders.length +
    (filters.dateRange.start ? 1 : 0) + (filters.dateRange.end ? 1 : 0) +
    (filters.searchQuery ? 1 : 0)

  const handleArtifactClick = (artifact) => {
    setSelectedArtifact(artifact)
    requestAnimationFrame(() => setIsDetailOpen(true))
  }

  const handleCloseDetail = () => {
    setIsDetailOpen(false)
    setTimeout(() => setSelectedArtifact(null), 400)
  }

  return (
    <div className="landing">
      {/* Decorative rects */}
      <div className="rect-container" aria-hidden ref={rectContainerRef}>
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

      {/* Sticky header with login */}
      <header className="landing-header" ref={headerRef}>
        <div className="landing-header-left">
          <button
            className="landing-hamburger-btn"
            onClick={() => setIsFilterOpen(f => !f)}
            aria-label="Toggle filters"
          >
            ☰
            {activeFilterCount > 0 && (
              <span className="landing-filter-count">{activeFilterCount}</span>
            )}
          </button>
          <h1 className="landing-title">backstory</h1>
        </div>

        <div className="landing-login-row" role="form" aria-label="Login form">
          <label className="sr-only" htmlFor="username">Username</label>
          <input
            id="username"
            className="landing-input"
            placeholder="Username"
            aria-label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <label className="sr-only" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="landing-input"
            placeholder="Password"
            aria-label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <button
            className="landing-login-btn"
            onClick={handleLogin}
            disabled={!username || !password}
          >
            Login
          </button>
        </div>
      </header>

      {/* Filter panel */}
      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filterOptions={filterOptions}
        onFilterChange={setFilters}
      />

      {/* Public archive content */}
      <main className={`landing-body${isFilterOpen ? ' filter-open' : ''}${isDetailOpen ? ' detail-open' : ''}`}>
        <div className="landing-archive-info">
          <span className="landing-archive-label">Public Archive</span>
          <span className="landing-artifact-count">
            {filteredArtifacts.length} {filteredArtifacts.length === 1 ? 'artifact' : 'artifacts'}
            {activeFilterCount > 0 ? ' matching filters' : ''}
          </span>
        </div>

        {filteredArtifacts.length > 0 ? (
          <div className="landing-artifacts-list">
            {filteredArtifacts.map(artifact => (
              <ArtifactCard
                key={artifact.id}
                artifact={artifact}
                onClick={handleArtifactClick}
                isAdmin={false}
              />
            ))}
          </div>
        ) : (
          <div className="landing-empty">
            {activeFilterCount > 0
              ? <p>No artifacts match your current filters.</p>
              : <p>No public artifacts available.</p>
            }
          </div>
        )}
      </main>

      {/* Detail panel */}
      <DetailPanel
        artifact={selectedArtifact}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        isAdmin={false}
      />
    </div>
  )
}
