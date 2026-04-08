import { useState, useMemo, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { artifacts } from '../../data/artifacts'
import { collectionsMeta, isCollectionPrivate } from '../../data/collectionsMeta'
import ArtifactCard from '../../components/ArtifactCard'
import FilterPanel from '../../components/FilterPanel'
import DetailPanel from '../../components/DetailPanel'
import MapView from '../../components/MapView'
import { matchesSearch } from '../../utils/searchArtifacts'
import './ViewPage.css'

export default function ViewPage() {
  const { collectionId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [viewMode, setViewMode] = useState('cards')
  const [selectedArtifact, setSelectedArtifact] = useState(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState({
    tags: [], fileTypes: [], uploaders: [],
    dateRange: { start: '', end: '' },
    searchQuery: '',
  })

  const isAdmin = !!user
  const isPrivate = isCollectionPrivate(collectionId)
  const meta = collectionsMeta[collectionId]
  const archiveTitle = meta?.label ?? collectionId

  const headerRef = useRef(null)

  // Measure the actual rendered header height and expose it as a CSS variable
  // so the fixed panels (FilterPanel, DetailPanel) can start exactly below the navbar
  useEffect(() => {
    const header = headerRef.current
    if (!header) return
    const updateHeight = () => {
      const h = header.getBoundingClientRect().bottom
      document.querySelector('.view-page')?.style.setProperty('--navbar-height', `${h}px`)
    }
    updateHeight()
    const ro = new ResizeObserver(updateHeight)
    ro.observe(header)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    document.title = `${archiveTitle} — Backstory`
  }, [archiveTitle])

  if (isPrivate && !isAdmin) {
    return (
      <div className="view-access-denied">
        <div className="denied-card">
          <div className="denied-lock">🔒</div>
          <h1>Access Denied</h1>
          <p>You need permission to view <strong>{archiveTitle}</strong>.</p>
          <p className="denied-sub">
            This archive is restricted. If you believe you should have access, contact the archive administrator.
          </p>
          <button className="denied-login-btn" onClick={() => navigate('/')}>Sign In</button>
        </div>
      </div>
    )
  }

  const collectionArtifacts = useMemo(() => {
    return artifacts.filter(a => {
      const inCollection = a.collectionId === collectionId || a.tags?.[0] === collectionId
      const isPublic = isAdmin || a.privacy?.publicAccess !== false
      return inCollection && isPublic
    })
  }, [collectionId, isAdmin])

  // Derive filter options from the actual artifacts in this collection
  const filterOptions = useMemo(() => ({
    tags:      [...new Set(collectionArtifacts.flatMap(a => a.tags ?? []))],
    fileTypes: [...new Set(collectionArtifacts.map(a => a.fileType).filter(Boolean))],
    uploaders: [...new Set(collectionArtifacts.map(a => a.uploader).filter(Boolean))],
  }), [collectionArtifacts])

  const filteredArtifacts = useMemo(() => {
    return collectionArtifacts.filter(a => {
      if (filters.tags.length > 0 && !a.tags?.some(t => filters.tags.includes(t))) return false
      if (filters.fileTypes.length > 0 && !filters.fileTypes.includes(a.fileType)) return false
      if (filters.uploaders.length > 0 && !filters.uploaders.includes(a.uploader)) return false
      if (filters.dateRange.start || filters.dateRange.end) {
        const d = new Date(a.uploadDate)
        if (filters.dateRange.start && d < new Date(filters.dateRange.start)) return false
        if (filters.dateRange.end   && d > new Date(filters.dateRange.end))   return false
      }
      if (!matchesSearch(a, filters.searchQuery)) return false
      return true
    })
  }, [collectionArtifacts, filters])

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
    <div className="view-page">
      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filterOptions={filterOptions}
        onFilterChange={setFilters}
      />

      <header className="view-header" ref={headerRef}>
        <div className="view-header-left">
          <button
            className="view-hamburger-btn"
            onClick={() => setIsFilterOpen(f => !f)}
            aria-label="Toggle filters"
          >
            ☰
            {activeFilterCount > 0 && (
              <span className="view-filter-count">{activeFilterCount}</span>
            )}
          </button>
          <div className="view-header-text">
            <span className="view-archive-label">Archive</span>
            <h1 className="view-title">{archiveTitle}</h1>
            {meta?.description && <p className="view-description">{meta.description}</p>}
          </div>
        </div>

        <div className="view-header-center">
          <div className="view-mode-toggle">
            <button
              className={`view-mode-btn ${viewMode === 'cards' ? 'active' : ''}`}
              onClick={() => setViewMode('cards')}
              aria-label="Card view"
            >
              ⊞ Cards
            </button>
            <button
              className={`view-mode-btn ${viewMode === 'map' ? 'active' : ''}`}
              onClick={() => setViewMode('map')}
              aria-label="Map view"
            >
              ◉ Map
            </button>
          </div>
        </div>

        <div className="view-header-right">
          {isPrivate && isAdmin && <span className="view-private-badge">🔒 Private</span>}
          <span className="view-readonly-badge">👁 Read-only</span>
          {isAdmin && (
            <button className="view-admin-btn" onClick={() => navigate('/archive')}>← Admin</button>
          )}
        </div>
      </header>

      <div className={`view-body${viewMode === 'map' ? ' view-body--map' : ''}${viewMode === 'cards' && isFilterOpen ? ' filter-open' : ''}${viewMode === 'cards' && isDetailOpen ? ' detail-open' : ''}`}>
        {viewMode === 'map' ? (
          <MapView
            artifacts={filteredArtifacts}
            onArtifactClick={handleArtifactClick}
          />
        ) : filteredArtifacts.length === 0 ? (
          <div className="view-empty">
            {activeFilterCount > 0
              ? <p>No artifacts match your current filters.</p>
              : <p>No public artifacts in this archive.</p>
            }
          </div>
        ) : (
          <div className="view-artifacts-list">
            {filteredArtifacts.map(artifact => (
              <ArtifactCard
                key={artifact.id}
                artifact={artifact}
                onClick={handleArtifactClick}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        )}
      </div>

      <DetailPanel
        artifact={selectedArtifact}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        isAdmin={isAdmin}
      />
    </div>
  )
}
