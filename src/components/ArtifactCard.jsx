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
                                className="artifact-icon-btn"
                                onClick={handleEdit}
                                aria-label={`Edit ${artifact.title}`}
                                title="Edit"
                            >
                                {/* Pencil icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                </svg>
                            </button>
                        )}
                        <button
                            className="artifact-icon-btn"
                            onClick={handleDownload}
                            aria-label={`Download ${artifact.title}`}
                            title="Download"
                        >
                            {/* Download icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="7 10 12 15 17 10"/>
                                <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
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
