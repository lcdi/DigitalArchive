import './ArtifactCard.css';
import { downloadArtifact } from '../utils/downloadArtifact.js';

/**
 * ArtifactCard
 * @prop {Object}  artifact
 * @prop {Function} onClick
 * @prop {boolean}  isAdmin  – when false, hides private/IRB badges and pseudonym markers
 */
function ArtifactCard({ artifact, onClick, isAdmin = false, canEdit = false, onEdit }) {
    const handleDownload = async (e) => {
        e.stopPropagation();
        await downloadArtifact(artifact);
    };

    const handleEdit = (e) => {
        e.stopPropagation();
        onEdit(artifact);
    };

    // Viewers see the subject name as-is; the "(Pseudonym)" note is admin-only context
    const showPseudonymMarker = isAdmin && artifact.subject?.isPseudonym;

    return (
        <div className="artifact-card" onClick={() => onClick(artifact)}>
            <div className="artifact-image">
                <img src={artifact.image} alt={artifact.title} />
                {/* Privacy lock overlay — admin only */}
                {isAdmin && artifact.privacy?.identityProtected && (
                    <div className="privacy-overlay">
                        <span className="privacy-icon">🔒</span>
                    </div>
                )}
            </div>

            <div className="artifact-info">
                <div className="artifact-header">
                    <h3>{artifact.title}</h3>
                    <div className="artifact-actions">
                        {canEdit && (
                            <button
                                className="edit-btn-card"
                                onClick={handleEdit}
                                aria-label={`Edit ${artifact.title}`}
                            >
                                Edit
                            </button>
                        )}
                        <button
                            className="download-btn-card"
                            onClick={handleDownload}
                            aria-label={`Download ${artifact.title}`}
                        >
                            Download
                        </button>
                    </div>
                </div>

                {/* Subject & Location Preview */}
                <div className="artifact-preview">
                    {artifact.subject?.name && (
                        <p className="preview-item">
                            <span className="preview-label">Subject:</span> {artifact.subject.name}
                            {showPseudonymMarker && (
                                <span className="pseudonym-indicator" title="Pseudonym used">*</span>
                            )}
                        </p>
                    )}
                    {artifact.location?.city && (
                        <p className="preview-item">
                            <span className="preview-label">Location:</span>{' '}
                            {artifact.location.city}, {artifact.location.state}
                        </p>
                    )}
                </div>

                {artifact.tags?.length > 0 && (
                    <div className="artifact-tags">
                        {artifact.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="tag">{tag}</span>
                        ))}
                        {artifact.tags.length > 3 && (
                            <span className="tag tag-more">+{artifact.tags.length - 3} more</span>
                        )}
                    </div>
                )}

                <div className="artifact-meta-row">
                    {artifact.uploader && (
                        <p className="artifact-meta">
                            <span className="meta-icon">👤</span> {artifact.uploader}
                        </p>
                    )}
                    {artifact.uploadDate && (
                        <p className="artifact-meta">
                            <span className="meta-icon">📅</span>{' '}
                            {new Date(artifact.uploadDate).toLocaleDateString()}
                        </p>
                    )}
                </div>

                {/* IRB badge — admin only */}
                {isAdmin && artifact.consent?.irbApproved && (
                    <div className="irb-indicator">
                        <span className="irb-check">✓</span> IRB Approved
                    </div>
                )}
            </div>
        </div>
    );
}

export default ArtifactCard;
