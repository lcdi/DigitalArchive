import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { artifacts } from '../../data/artifacts'
import { collectionsMeta, isCollectionPrivate } from '../../data/collectionsMeta'
import ArtifactCard from '../../components/ArtifactCard'
import DetailPanel from '../../components/DetailPanel'
import './ViewPage.css'

export default function ViewPage() {
  const { collectionId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [selectedArtifact, setSelectedArtifact] = useState(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const isAdmin = !!user
  const isPrivate = isCollectionPrivate(collectionId)
  const meta = collectionsMeta[collectionId]

  // Gate: private archive + not admin → Access Denied
  if (isPrivate && !isAdmin) {
    return (
      <div className="view-access-denied">
        <div className="denied-card">
          <div className="denied-lock">🔒</div>
          <h1>Access Denied</h1>
          <p>
            You need permission to view <strong>{meta?.label ?? collectionId}</strong>.
          </p>
          <p className="denied-sub">
            This archive is restricted. If you believe you should have access, contact the archive administrator.
          </p>
          <button className="denied-login-btn" onClick={() => navigate('/')}>
            Sign In
          </button>
        </div>
      </div>
    )
  }

  // Collect artifacts for this collection
  // Public viewers only see artifacts where publicAccess is not explicitly false
  const collectionArtifacts = useMemo(() => {
    return artifacts.filter(a => {
      const inCollection = a.collectionId === collectionId || a.tags?.[0] === collectionId
      const isPublicArtifact = isAdmin || a.privacy?.publicAccess !== false
      return inCollection && isPublicArtifact
    })
  }, [collectionId, isAdmin])

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
      <header className="view-header">
        <div className="view-header-left">
          <span className="view-archive-label">Archive</span>
          <h1 className="view-title">{meta?.label ?? collectionId}</h1>
          {meta?.description && (
            <p className="view-description">{meta.description}</p>
          )}
        </div>
        <div className="view-header-right">
          {isPrivate && isAdmin && (
            <span className="view-private-badge">🔒 Private</span>
          )}
          <span className="view-readonly-badge">👁 Read-only view</span>
          {isAdmin ? (
            <button className="view-admin-btn" onClick={() => navigate('/archive')}>
              ← Back to Admin
            </button>
          ) : (
            <button className="view-signin-btn" onClick={() => navigate('/')}>
              Sign In
            </button>
          )}
        </div>
      </header>

      <div className={`view-content ${isDetailOpen ? 'detail-open' : ''}`}>
        {collectionArtifacts.length === 0 ? (
          <div className="view-empty">
            <p>No public artifacts in this archive.</p>
          </div>
        ) : (
          <div className="view-artifacts-list">
            {collectionArtifacts.map(artifact => (
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
