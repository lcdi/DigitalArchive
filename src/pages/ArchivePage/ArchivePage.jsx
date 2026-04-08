import { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './ArchivePage.css'
import ArtifactCard from '../../components/ArtifactCard'
import CollectionFolder from '../../components/CollectionFolder'
import FilterPanel from '../../components/FilterPanel'
import DetailPanel from '../../components/DetailPanel'
import AddArtifactModal from '../../components/AddArtifactModal'
import { usePermissions } from '../../context/AuthContext'
import { artifacts as initialArtifacts, filterOptions } from '../../data/artifacts'
import { collectionsMeta, isCollectionPrivate } from '../../data/collectionsMeta'
import { applyFilters } from '../../utils/filterArtifacts'

function ArchivePage() {

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
  const [copiedCollectionId, setCopiedCollectionId] = useState(null)
  // Stores per-session edits to collection name/description/privacy
  const [collectionOverrides, setCollectionOverrides] = useState({})

  const headerRef = useRef(null)

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

  // ── Document title ──
  useEffect(() => {
    if (viewMode === 'collections') {
      document.title = 'Backstory — Collections'
    } else if (activeCollection) {
      document.title = `${activeCollection.name} — Backstory`
    }
  }, [viewMode, activeCollection])

  const handleUpdateCollection = (collectionId, updates) => {    setCollectionOverrides(prev => ({
      ...prev,
      [collectionId]: { ...prev[collectionId], ...updates }
    }))
  }

  const handleShareCollection = (collectionId) => {
    const url = `${window.location.origin}/view/${collectionId}`

    // Try modern clipboard API first, fall back to execCommand for non-HTTPS
    if (navigator.clipboard && navigator.clipboard.writeText) {
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
    el.style.position = 'fixed'
    el.style.opacity = '0'
    document.body.appendChild(el)
    el.focus()
    el.select()
    try {
      document.execCommand('copy')
      setCopiedCollectionId(collectionId)
      setTimeout(() => setCopiedCollectionId(null), 2000)
    } catch (err) {
      // Last resort: show URL in prompt so user can copy manually
      window.prompt('Copy the share link:', url)
    }
    document.body.removeChild(el)
  }
  const [filters, setFilters] = useState({
    tags: [],
    fileTypes: [],
    uploaders: [],
    dateRange: { start: '', end: '' },
    searchQuery: '',
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
    return applyFilters(base, filters)
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
            {/* Preview button — links to the public view of the active collection */}
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
            {collections.map(collection => {
              const override = collectionOverrides[collection.id] ?? {}
              const resolvedName = override.name ?? collectionsMeta[collection.id]?.label ?? collection.name
              const resolvedPrivate = override.isPrivate ?? isCollectionPrivate(collection.id)
              const resolvedMeta = {
                ...collectionsMeta[collection.id],
                description: override.description ?? collectionsMeta[collection.id]?.description ?? '',
              }
              const displayCollection = { ...collection, name: resolvedName }
              return (
                <CollectionFolder
                  key={collection.id}
                  collection={displayCollection}
                  onClick={handleOpenCollection}
                  isPrivate={resolvedPrivate}
                  isAdmin={perms.isAdmin}
                  onShare={() => handleShareCollection(collection.id)}
                  shareCopied={copiedCollectionId === collection.id}
                  onUpdate={(updates) => handleUpdateCollection(collection.id, updates)}
                  collectionMeta={resolvedMeta}
                />
              )
            })}

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
      </div> {/* end content-body */}
      </div> {/* end main-content */}

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
