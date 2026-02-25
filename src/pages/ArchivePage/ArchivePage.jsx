import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import './ArchivePage.css'
import ArtifactCard from '../../components/ArtifactCard'
import CollectionFolder from '../../components/CollectionFolder'
import FilterPanel from '../../components/FilterPanel'
import DetailPanel from '../../components/DetailPanel'
import AddArtifactModal from '../../components/AddArtifactModal'
import { useAuth, usePermissions } from '../../context/AuthContext'
import { artifacts as initialArtifacts, filterOptions } from '../../data/artifacts'

function ArchivePage() {
  const { user, logout } = useAuth()
  const perms = usePermissions()
  const navigate = useNavigate()

  const [artifacts, setArtifacts] = useState(initialArtifacts)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedArtifact, setSelectedArtifact] = useState(null)
  const [viewMode, setViewMode] = useState('collections') // 'collections' | 'artifacts'
  const [activeCollection, setActiveCollection] = useState(null)
  const [manualCollections, setManualCollections] = useState([])
  const [isNewCollectionModalOpen, setIsNewCollectionModalOpen] = useState(false)
  const [newCollectionName, setNewCollectionName] = useState('')
  const [addTargetCollectionId, setAddTargetCollectionId] = useState(null)
  const [filters, setFilters] = useState({
    tags: [],
    fileTypes: [],
    uploaders: [],
    dateRange: { start: '', end: '' }
  })

  // Viewers only see artifacts where publicAccess is true (or undefined, treated as public)
  const visibleArtifacts = useMemo(() => {
    if (perms.canViewPrivateArtifacts) return artifacts
    return artifacts.filter(a => a.privacy?.publicAccess !== false)
  }, [artifacts, perms.canViewPrivateArtifacts])

  const derivedCollections = useMemo(() => {
    const collectionMap = {}
    visibleArtifacts.forEach(artifact => {
      if (artifact.collectionId) return
      const primaryTag = artifact.tags[0]
      if (!primaryTag) return
      if (!collectionMap[primaryTag]) {
        collectionMap[primaryTag] = { id: primaryTag, name: primaryTag, type: 'derived', artifacts: [] }
      }
      collectionMap[primaryTag].artifacts.push(artifact)
    })
    return Object.values(collectionMap)
  }, [visibleArtifacts])

  const collections = useMemo(() => [
    ...derivedCollections,
    ...manualCollections.map(mc => ({
      ...mc,
      artifacts: visibleArtifacts.filter(a => a.collectionId === mc.id)
    }))
  ], [derivedCollections, manualCollections, visibleArtifacts])

  const filteredArtifacts = useMemo(() => {
    let base = visibleArtifacts
    if (activeCollection) {
      if (activeCollection.type === 'manual') {
        base = visibleArtifacts.filter(a => a.collectionId === activeCollection.id)
      } else {
        base = visibleArtifacts.filter(a => a.tags[0] === activeCollection.id && !a.collectionId)
      }
    }
    return base.filter(artifact => {
      if (filters.tags.length > 0) {
        if (!artifact.tags.some(tag => filters.tags.includes(tag))) return false
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
      return true
    })
  }, [filters, visibleArtifacts, activeCollection])

  const handleArtifactClick = (artifact) => {
    setSelectedArtifact(artifact)
    requestAnimationFrame(() => setIsDetailOpen(true))
  }

  const handleCloseDetail = () => {
    setIsDetailOpen(false)
    setTimeout(() => setSelectedArtifact(null), 400)
  }

  const handleSaveArtifact = (newArtifact) => {
    setArtifacts(prev => [newArtifact, ...prev])
    setIsAddModalOpen(false)
  }

  const handleOpenCollection = (collection) => {
    setActiveCollection(collection)
    setViewMode('artifacts')
  }

  const handleCreateCollection = () => {
    const name = newCollectionName.trim()
    if (!name) return
    setManualCollections(prev => [
      ...prev,
      { id: `manual-${Date.now()}`, name, type: 'manual' }
    ])
    setNewCollectionName('')
    setIsNewCollectionModalOpen(false)
  }

  const handleBackToCollections = () => {
    setViewMode('collections')
    setActiveCollection(null)
    setIsDetailOpen(false)
    setSelectedArtifact(null)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="app">
      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filterOptions={filterOptions}
        onFilterChange={setFilters}
      />

      <div className={`main-content ${isFilterOpen ? 'filter-open' : ''} ${isDetailOpen ? 'detail-open' : ''}`}>
        <header className="app-header">
          <button
            className="hamburger-btn"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            aria-label="Toggle filters"
          >
            ☰
          </button>

          <h1>Digital Archive</h1>

          {/* Role badge */}
          <div className={`role-badge ${perms.isAdmin ? 'role-badge--admin' : 'role-badge--viewer'}`}>
            {perms.isAdmin ? '✏️ Admin' : '👁 Viewer'}
          </div>

          {perms.canAddArtifacts && (
            <button
              className="add-artifact-btn"
              onClick={() => { setAddTargetCollectionId(null); setIsAddModalOpen(true) }}
              aria-label="Add new artifact"
            >
              + Add Artifact
            </button>
          )}

          <button className="logout-btn" onClick={handleLogout} aria-label="Logout">
            Logout
          </button>
        </header>

        {/* Viewer banner */}
        {perms.isViewer && (
          <div className="viewer-banner">
            👁 You are viewing a read-only snapshot of this archive. Only publicly accessible artifacts are shown.
          </div>
        )}

        {viewMode === 'collections' ? (
          <div className="collections-grid">
            {collections.map(collection => (
              <CollectionFolder
                key={collection.id}
                collection={collection}
                onClick={handleOpenCollection}
              />
            ))}

            {/* Only admins can create new collections */}
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
              {perms.canAddArtifacts && activeCollection?.type === 'manual' && (
                <button
                  className="add-to-collection-btn"
                  onClick={() => { setAddTargetCollectionId(activeCollection.id); setIsAddModalOpen(true) }}
                >
                  + Add to {activeCollection.name}
                </button>
              )}
            </div>

            {filteredArtifacts.length > 0 ? (
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
          collections={manualCollections}
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
