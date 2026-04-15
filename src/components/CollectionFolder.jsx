import { useState } from 'react'
import './CollectionFolder.css'

export default function CollectionFolder({
  collection,
  artifactCount: artifactCountProp,
  onClick,
  isPrivate = false,
  isAdmin = false,
  onShare,
  shareCopied = false,
  onUpdate,
  collectionMeta,
}) {
  const artifactCount = artifactCountProp ?? collection.artifacts?.length ?? 0
  const [showSettings, setShowSettings] = useState(false)
  const [imgError, setImgError] = useState(false)

  // Grab first artifact image for the preview thumbnail
  const previewImage = collection.artifacts?.find(a => a.image)?.image ?? null

  const [editName, setEditName]               = useState(collection.name)
  const [editDescription, setEditDescription] = useState(collectionMeta?.description ?? '')
  const [editPrivate, setEditPrivate]         = useState(isPrivate)

  const handleShareClick = (e) => {
    e.stopPropagation()
    onShare?.()
  }

  const handleGearClick = (e) => {
    e.stopPropagation()
    // Reset to current values each time the modal opens
    setEditName(collection.name)
    setEditDescription(collectionMeta?.description ?? '')
    setEditPrivate(isPrivate)
    setShowSettings(true)
  }

  const handleSave = (e) => {
    e.stopPropagation()
    onUpdate?.({
      name: editName.trim() || collection.name,
      description: editDescription.trim(),
      isPrivate: editPrivate,
    })
    setShowSettings(false)
  }

  const handleCancel = (e) => {
    e.stopPropagation()
    setShowSettings(false)
  }

  const handleOverlayClick = (e) => {
    e.stopPropagation()
    setShowSettings(false)
  }

  return (
    <>
      <div className="collection-folder" onClick={() => onClick(collection)}>
        {/* Thumbnail from first artifact */}
        <div className="collection-thumb">
          {previewImage && !imgError ? (
            <img
              src={previewImage}
              alt=""
              onError={() => setImgError(true)}
            />
          ) : (
            <span className="collection-thumb-icon">{isPrivate ? '🔒' : '📁'}</span>
          )}
        </div>

        <div className="collection-folder-body">
          <div className="collection-folder-title-row">
            <span className="collection-folder-name">{collection.name}</span>
            {isPrivate && (
              <span className="collection-private-badge">Private</span>
            )}
          </div>
          {collectionMeta?.description && (
            <span className="collection-folder-desc">{collectionMeta.description}</span>
          )}
          <span className="collection-folder-count">
            {artifactCount} {artifactCount === 1 ? 'artifact' : 'artifacts'}
          </span>
        </div>

        <div className="collection-folder-actions" onClick={e => e.stopPropagation()}>
          <button
            className={`collection-share-btn ${shareCopied ? 'copied' : ''}`}
            onClick={handleShareClick}
            title={isPrivate ? 'Share link (requires sign-in)' : 'Copy share link'}
            aria-label={`Share ${collection.name}`}
          >
            {shareCopied ? '✓ Copied' : '🔗 Share'}
          </button>

          {isAdmin && (
            <button
              className="collection-gear-btn"
              onClick={handleGearClick}
              title="Collection settings"
              aria-label={`Settings for ${collection.name}`}
            >
              ⚙️
            </button>
          )}
        </div>
      </div>

      {/* Settings modal */}
      {showSettings && (
        <div className="cf-modal-overlay" onClick={handleOverlayClick}>
          <div className="cf-modal" onClick={e => e.stopPropagation()}>
            <h2 className="cf-modal-title">Collection Settings</h2>

            <label className="cf-label">
              Name
              <input
                className="cf-input"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                placeholder="Collection name"
              />
            </label>

            <label className="cf-label">
              Description
              <textarea
                className="cf-textarea"
                value={editDescription}
                onChange={e => setEditDescription(e.target.value)}
                placeholder="Describe this collection…"
                rows={3}
              />
            </label>

            <label className="cf-label cf-privacy-row">
              <span>Private archive</span>
              <span className="cf-privacy-hint">
                {editPrivate
                  ? 'Only admins can view this archive'
                  : 'Anyone with the share link can view'}
              </span>
              <button
                type="button"
                className={`cf-toggle ${editPrivate ? 'on' : 'off'}`}
                onClick={() => setEditPrivate(p => !p)}
                aria-pressed={editPrivate}
              >
                <span className="cf-toggle-knob" />
              </button>
            </label>

            <div className="cf-modal-actions">
              <button className="cf-btn-cancel" onClick={handleCancel}>Cancel</button>
              <button className="cf-btn-save" onClick={handleSave}>Save</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

