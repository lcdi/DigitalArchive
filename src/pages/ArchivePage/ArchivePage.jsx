import { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './ArchivePage.css'
import ArtifactCard from '../../components/ArtifactCard'
import CollectionFolder from '../../components/CollectionFolder'
import FilterPanel from '../../components/FilterPanel'
import DetailPanel from '../../components/DetailPanel'
import AddArtifactModal from '../../components/AddArtifactModal'
import { usePermissions } from '../../context/AuthContext'
import { api } from '../../utils/api'
import { matchesSearch } from '../../utils/searchArtifacts'

function ArchivePage() {
  const perms = usePermissions()
  const navigate = useNavigate()

  const [archives, setArchives] = useState([])
  const [archivesLoading, setArchivesLoading] = useState(true)
  const [artifacts, setArtifacts] = useState([])
  const [artifactsLoading, setArtifactsLoading] = useState(false)

  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedArtifact, setSelectedArtifact] = useState(null)
  const [viewMode, setViewMode] = useState('collections') // 'collections' | 'artifacts'
  const [activeCollection, setActiveCollection] = useState(null)
  const [isNewCollectionModalOpen, setIsNewCollectionModalOpen] = useState(false)
  const [newCollectionName, setNewCollectionName] = useState('')
  const [addTargetCollectionId, setAddTargetCollectionId] = useState(null)
  const [copiedCollectionId, setCopiedCollectionId] = useState(null)

  const headerRef = useRef(null)

  // Measure header height for CSS variable used by fixed panels
  useEffect(() => {
    const header = headerRef.current
    if (!header) return
    const updateHeight = () => {
      const h = header.getBoundingClientRect().bottom
      document.querySelector('.app')?.style.setProperty('--navbar-height', `${h}px`)
    }
    updateHeight()
    const ro = new ResizeObserver(updateHeight)
    ro.observe(header)
    return () => ro.disconnect()
  }, [])

  // Document title
  useEffect(() => {
    if (viewMode === 'collections') {
      document.title = 'Backstory — Collections'
    } else if (activeCollection) {
      document.title = `${activeCollection.name} — Backstory`
    }
  }, [viewMode, activeCollection])

  // Fetch archives on mount
  useEffect(() => {
    api.get('/archives')
      .then(setArchives)
      .catch(err => console.error('Failed to load archives:', err))
      .finally(() => setArchivesLoading(false))
  }, [])

  // Fetch artifacts whenever the active collection changes
  useEffect(() => {
    if (!activeCollection) { setArtifacts([]); return }
    setArtifactsLoading(true)
    api.get(`/archives/${activeCollection.id}/artifacts`)
      .then(setArtifacts)
      .catch(err => console.error('Failed to load artifacts:', err))
      .finally(() => setArtifactsLoading(false))
  }, [activeCollection?.id])

  const [filters, setFilters] = useState({
    tags: [],
    fileTypes: [],
    uploaders: [],
    dateRange: { start: '', end: '' },
    searchQuery: '',
  })

  // Derive filter options from whatever artifacts are currently loaded
  const filterOptions = useMemo(() => ({
    tags:      [...new Set(artifacts.flatMap(a => a.tags ?? []))],
    fileTypes: [...new Set(artifacts.map(a => a.fileType).filter(Boolean))],
    uploaders: [...new Set(artifacts.map(a => a.uploader).filter(Boolean))],
  }), [artifacts])

  const filteredArtifacts = useMemo(() => {
    return artifacts.filter(artifact => {
      if (filters.tags.length > 0) {
        if (!artifact.tags?.some(tag => filters.tags.includes(tag))) return false
      }
      if (filters.fileTypes.length > 0) {
        if (!filters.fileTypes.includes(artifact.fileType)) return false
      }
      if (filters.uploaders.length > 0) {
        if (!filters.uploaders.includes(artifact.uploader)) return false
      }
      if (filters.dateRange.start || filters.dateRange.end) {
        const artifactDate = new Date(artifact.uploadDate)
        if (filters.dateRange.start && artifactDate < new Date(filters.dateRange.start)) return false
        if (filters.dateRange.end   && artifactDate > new Date(filters.dateRange.end))   return false
      }
      if (!matchesSearch(artifact, filters.searchQuery)) return false
      return true
    })
  }, [filters, artifacts])

  const handleUpdateCollection = async (collectionId, updates) => {
    const patch = {}
    if (updates.name        !== undefined) patch.name        = updates.name
    if (updates.description !== undefined) patch.description = updates.description
    if (updates.isPrivate   !== undefined) patch.is_private  = updates.isPrivate
    try {
      await api.patch(`/archives/${collectionId}`, patch)
      setArchives(prev => prev.map(a => a.id === collectionId ? { ...a, ...patch } : a))
      if (activeCollection?.id === collectionId) {
        setActiveCollection(prev => ({ ...prev, ...patch }))
      }
    } catch (err) {
      console.error('Failed to update archive:', err)
    }
  }

  const handleShareCollection = (collectionId) => {
    const url = `${window.location.origin}/view/${collectionId}`
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url)
        .then(() => {
          setCopiedCollectionId(collectionId)
          setTimeout(() => setCopiedCollectionId(null), 2000)
        })
        .catch(() => fallbackCopy(url, collectionId))
    } else {
      fallbackCopy(url, collectionId)
    }
  }

  const fallbackCopy = (url, collectionId) => {
    const el = document.createElement('textarea')
    el.value = url
    el.style.cssText = 'position:fixed;opacity:0'
    document.body.appendChild(el)
    el.focus()
    el.select()
    try {
      document.execCommand('copy')
      setCopiedCollectionId(collectionId)
      setTimeout(() => setCopiedCollectionId(null), 2000)
    } catch {
      window.prompt('Copy the share link:', url)
    }
    document.body.removeChild(el)
  }

  const handleArtifactClick = (artifact) => {
    setSelectedArtifact(artifact)
    requestAnimationFrame(() => setIsDetailOpen(true))
  }

  const handleCloseDetail = () => {
    setIsDetailOpen(false)
    setTimeout(() => setSelectedArtifact(null), 400)
  }

  const handleSaveArtifact = async (newArtifact) => {
    try {
      const loc = newArtifact.location
      const locationStr = typeof loc === 'object'
        ? [loc.city, loc.state, loc.country].filter(Boolean).join(', ')
        : (loc ?? '')

      const created = await api.post('/artifacts', {
        title:       newArtifact.title,
        type:        newArtifact.type,
        description: newArtifact.description,
        location:    locationStr,
        is_private:  newArtifact.privacy?.publicAccess === false,
        metadata:    newArtifact,
      })

      const targetArchiveId = addTargetCollectionId ?? activeCollection?.id
      if (targetArchiveId) {
        await api.post(`/archives/${targetArchiveId}/artifacts`, { artifact_id: created.id })
      }

      setArtifacts(prev => [created, ...prev])
      setArchives(prev => prev.map(a =>
        a.id === targetArchiveId ? { ...a, artifact_count: (a.artifact_count || 0) + 1 } : a
      ))
    } catch (err) {
      console.error('Failed to save artifact:', err)
    }
    setIsAddModalOpen(false)
  }

  const handleOpenCollection = (collection) => {
    setActiveCollection(collection)
    setViewMode('artifacts')
  }

  const handleCreateCollection = async () => {
    const name = newCollectionName.trim()
    if (!name) return
    try {
      const archive = await api.post('/archives', { name })
      setArchives(prev => [...prev, archive])
    } catch (err) {
      console.error('Failed to create archive:', err)
    }
    setNewCollectionName('')
    setIsNewCollectionModalOpen(false)
  }

  const handleBackToCollections = () => {
    setViewMode('collections')
    setActiveCollection(null)
    setArtifacts([])
    setIsDetailOpen(false)
    setSelectedArtifact(null)
  }

  return (
    <div className="app">
      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filterOptions={filterOptions}
        onFilterChange={setFilters}
      />

      <div className="main-content">
        <header className="app-header" ref={headerRef}>
          <button
            className="hamburger-btn"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            aria-label="Toggle filters"
          >
            ☰
          </button>

          <div className="app-header-actions">
            {viewMode === 'artifacts' && activeCollection && (
              <button
                className="preview-btn"
                onClick={() => navigate(`/view/${activeCollection.id}`)}
                aria-label={`Preview ${activeCollection.name} as public viewer`}
              >
                👁 Preview
              </button>
            )}

            {perms.canAddArtifacts && (
              <button
                className="add-artifact-btn"
                onClick={() => { setAddTargetCollectionId(null); setIsAddModalOpen(true) }}
                aria-label="Add new artifact"
              >
                + Add Artifact
              </button>
            )}
          </div>
        </header>

        <div className={`content-body ${isFilterOpen ? 'filter-open' : ''} ${isDetailOpen ? 'detail-open' : ''}`}>

          {viewMode === 'collections' ? (
            <div className="collections-grid">
              {archivesLoading ? (
                <p className="loading-msg">Loading collections…</p>
              ) : (
                archives.map(archive => (
                  <CollectionFolder
                    key={archive.id}
                    collection={archive}
                    artifactCount={archive.artifact_count ?? 0}
                    onClick={handleOpenCollection}
                    isPrivate={archive.is_private}
                    isAdmin={perms.isAdmin}
                    onShare={() => handleShareCollection(archive.id)}
                    shareCopied={copiedCollectionId === archive.id}
                    onUpdate={(updates) => handleUpdateCollection(archive.id, updates)}
                    collectionMeta={{ description: archive.description ?? '' }}
                  />
                ))
              )}

              {perms.canCreateCollections && (
                <button
                  className="add-collection-card"
                  onClick={() => setIsNewCollectionModalOpen(true)}
                  aria-label="Create new collection"
                >
                  <span className="add-collection-plus">+</span>
                  <span className="add-collection-label">New Collection</span>
                </button>
              )}
            </div>
          ) : (
            <div className="artifacts-list">
              <div className="artifacts-list-header">
                <button className="back-to-collections-btn" onClick={handleBackToCollections}>
                  ← Collections
                </button>
                {activeCollection && (
                  <span className="active-collection-label">{activeCollection.name}</span>
                )}
                {perms.canAddArtifacts && (
                  <button
                    className="add-to-collection-btn"
                    onClick={() => { setAddTargetCollectionId(activeCollection?.id); setIsAddModalOpen(true) }}
                  >
                    + Add to {activeCollection?.name}
                  </button>
                )}
              </div>

              {artifactsLoading ? (
                <p className="loading-msg">Loading artifacts…</p>
              ) : filteredArtifacts.length > 0 ? (
                filteredArtifacts.map(artifact => (
                  <ArtifactCard
                    key={artifact.id}
                    artifact={artifact}
                    onClick={handleArtifactClick}
                    isAdmin={perms.isAdmin}
                  />
                ))
              ) : (
                <div className="no-results">
                  <p>No artifacts found matching your filters.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <DetailPanel
        artifact={selectedArtifact}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        isAdmin={perms.isAdmin}
      />

      {perms.canAddArtifacts && (
        <AddArtifactModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleSaveArtifact}
          collections={archives}
          targetCollectionId={addTargetCollectionId}
        />
      )}

      {perms.canCreateCollections && isNewCollectionModalOpen && (
        <div className="new-collection-overlay" onClick={() => setIsNewCollectionModalOpen(false)}>
          <div className="new-collection-modal" onClick={e => e.stopPropagation()}>
            <h2>New Collection</h2>
            <input
              className="new-collection-input"
              type="text"
              placeholder="Collection name"
              value={newCollectionName}
              onChange={e => setNewCollectionName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreateCollection()}
              autoFocus
            />
            <div className="new-collection-actions">
              <button className="new-collection-cancel" onClick={() => { setIsNewCollectionModalOpen(false); setNewCollectionName('') }}>
                Cancel
              </button>
              <button className="new-collection-create" onClick={handleCreateCollection} disabled={!newCollectionName.trim()}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ArchivePage
