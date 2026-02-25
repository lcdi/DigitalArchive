import './CollectionFolder.css'

function CollectionFolder({ collection, onClick }) {
  const { name, artifacts } = collection
  const previewImages = artifacts.slice(0, 4)

  return (
    <div className="collection-folder" onClick={() => onClick(collection)}>
      <div className="folder-tab" />

      <div className={`folder-images count-${Math.min(previewImages.length, 4)}`}>
        {previewImages.map((artifact) => (
          <div key={artifact.id} className="folder-image-slot">
            <img src={artifact.image} alt={artifact.title} />
          </div>
        ))}
        {previewImages.length === 0 && (
          <div className="folder-empty">
            <span className="folder-empty-icon">📁</span>
            <span>Empty collection</span>
          </div>
        )}
      </div>

      <div className="folder-footer">
        <span className="folder-name">{name}</span>
        <span className="folder-count">
          {artifacts.length} {artifacts.length === 1 ? 'item' : 'items'}
        </span>
      </div>
    </div>
  )
}

export default CollectionFolder
