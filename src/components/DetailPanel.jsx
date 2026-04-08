import './DetailPanel.css';
import { downloadArtifact } from '../utils/downloadArtifact.js';

function MediaPreview({ artifact }) {
    const { fileType, image, title } = artifact;
    if (!image) return null;

    if (fileType?.startsWith('audio/')) {
        return (
            <div className="detail-media detail-media--audio">
                <div className="detail-media-icon" aria-hidden="true">🎵</div>
                <p className="detail-media-filename">{title}</p>
                <audio controls src={image} className="detail-audio">
                    Your browser does not support audio playback.
                </audio>
            </div>
        );
    }

    if (fileType?.startsWith('video/')) {
        return (
            <div className="detail-media detail-media--video">
                <video controls src={image} className="detail-video">
                    Your browser does not support video playback.
                </video>
            </div>
        );
    }

    return (
        <div className="detail-image">
            <img src={image} alt={title} />
        </div>
    );
}

/**
 * DetailPanel
 * @prop {Object}   artifact
 * @prop {boolean}  isOpen
 * @prop {Function} onClose
 * @prop {boolean}  isAdmin – gates IRB info, consent details, privacy notes, pseudonym context
 */
function DetailPanel({ artifact, isOpen, onClose, isAdmin = false }) {
    if (!artifact) return null;

    const handleDownload = async () => {
        await downloadArtifact(artifact);
    };

    // Pseudonym note is shown to admins so they know the name is protected
    const showPseudonymNote = isAdmin && artifact.subject?.isPseudonym;

    return (
        <div className={`detail-panel ${isOpen ? 'open' : ''}`}>
            <div className="detail-header">
                <h2>Artifact Details</h2>
                <button className="close-btn" onClick={onClose}>×</button>
            </div>

            <div className="detail-content">

                {/* ── Privacy banner (admin only) ─────────────── */}
                {isAdmin && artifact.privacy && (
                    <div className="privacy-banner">
                        <div className="privacy-badge">
                            <span className="lock-icon">🔒</span>
                            <span>{artifact.privacy.level}</span>
                        </div>
                        {artifact.subject?.isPseudonym && (
                            <div className="pseudonym-badge">Identity Protected</div>
                        )}
                    </div>
                )}

                <MediaPreview artifact={artifact} />

                <button
                    className="download-btn-detail"
                    onClick={handleDownload}
                    aria-label={`Download ${artifact.title}`}
                >
                    Download Artifact
                </button>

                {/* ── IRB & Consent status (admin only) ──────── */}
                {isAdmin && artifact.consent && (
                    <div className="consent-status">
                        {artifact.consent.irbApproved && (
                            <div className="irb-badge approved">
                                ✓ IRB Approved — {artifact.consent.irbNumber}
                            </div>
                        )}
                        {artifact.consent.formSigned && (
                            <div className="consent-badge">
                                Consent Form Signed ({new Date(artifact.consent.dateSigned).toLocaleDateString()})
                            </div>
                        )}
                    </div>
                )}

                <div className="detail-info">

                    {/* Title */}
                    {artifact.title && (
                        <div className="detail-section">
                            <h3>Title</h3>
                            <p>{artifact.title}</p>
                        </div>
                    )}

                    {/* Subject */}
                    {artifact.subject && (
                        <div className="detail-section">
                            <h3>Subject</h3>
                            <p>
                                <strong>Name:</strong> {artifact.subject.name}
                                {showPseudonymNote && (
                                    <span className="pseudonym-note"> (Pseudonym)</span>
                                )}
                            </p>
                            {artifact.subject.role && (
                                <p><strong>Role:</strong> {artifact.subject.role}</p>
                            )}
                            {artifact.subject.community && (
                                <p><strong>Community:</strong> {artifact.subject.community}</p>
                            )}
                        </div>
                    )}

                    {/* Context */}
                    {artifact.context && (
                        <div className="detail-section">
                            <h3>Context</h3>
                            <p>{artifact.context}</p>
                        </div>
                    )}

                    {/* Location */}
                    {artifact.location && (
                        <div className="detail-section">
                            <h3>Location</h3>
                            {artifact.location.place && (
                                <p><strong>Place:</strong> {artifact.location.place}</p>
                            )}
                            <p>
                                <strong>City/Region:</strong>{' '}
                                {artifact.location.city}, {artifact.location.state}
                            </p>
                            {artifact.location.country && (
                                <p><strong>Country:</strong> {artifact.location.country}</p>
                            )}
                            {artifact.location.coordinates && (
                                <p><strong>Coordinates:</strong> {artifact.location.coordinates}</p>
                            )}
                        </div>
                    )}

                    {/* Time Period */}
                    {artifact.timePeriod && (
                        <div className="detail-section">
                            <h3>Time Period</h3>
                            {artifact.timePeriod.created && (
                                <p><strong>Created:</strong> {artifact.timePeriod.created}</p>
                            )}
                            {artifact.timePeriod.documented && (
                                <p><strong>Documented:</strong> {artifact.timePeriod.documented}</p>
                            )}
                            {artifact.timePeriod.era && (
                                <p><strong>Era:</strong> {artifact.timePeriod.era}</p>
                            )}
                        </div>
                    )}

                    {/* Description */}
                    {artifact.description && (
                        <div className="detail-section">
                            <h3>Description</h3>
                            <p>{artifact.description}</p>
                        </div>
                    )}

                    {/* Physical Description */}
                    {artifact.physicalDescription && (
                        <div className="detail-section">
                            <h3>Physical Description</h3>
                            {artifact.physicalDescription.materials && (
                                <p><strong>Materials:</strong> {artifact.physicalDescription.materials}</p>
                            )}
                            {artifact.physicalDescription.dimensions && (
                                <p><strong>Dimensions:</strong> {artifact.physicalDescription.dimensions}</p>
                            )}
                            {artifact.physicalDescription.condition && (
                                <p><strong>Condition:</strong> {artifact.physicalDescription.condition}</p>
                            )}
                            {artifact.physicalDescription.weight && (
                                <p><strong>Weight:</strong> {artifact.physicalDescription.weight}</p>
                            )}
                        </div>
                    )}

                    {/* Function */}
                    {artifact.function && (
                        <div className="detail-section">
                            <h3>Function</h3>
                            <p>{artifact.function}</p>
                        </div>
                    )}

                    {/* Cultural Meaning */}
                    {artifact.meaning && (
                        <div className="detail-section">
                            <h3>Cultural Meaning</h3>
                            <p>{artifact.meaning}</p>
                        </div>
                    )}

                    {/* Transcript */}
                    {artifact.transcript && (
                        <div className="detail-section">
                            <h3>Interview Transcript</h3>
                            <div className="transcript-box">
                                <pre>{artifact.transcript}</pre>
                            </div>
                        </div>
                    )}

                    {/* Additional Media */}
                    {artifact.additionalMedia?.length > 0 && (
                        <div className="detail-section">
                            <h3>Additional Media</h3>
                            <div className="media-list">
                                {artifact.additionalMedia.map((media, index) => (
                                    <div key={index} className="media-item">
                                        <span className="media-type">{media.type.toUpperCase()}</span>
                                        <span className="media-title">{media.title}</span>
                                        {media.duration && <span className="media-duration">({media.duration})</span>}
                                        {media.count    && <span className="media-count">({media.count} files)</span>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Student Analysis */}
                    {artifact.analysis?.hasStudentWork && (
                        <div className="detail-section analysis-section">
                            <h3>Student Analysis</h3>
                            <div className="analysis-badge">Student Work Available</div>
                            <p><strong>Course:</strong> {artifact.analysis.course}</p>
                            <p><strong>Student:</strong> {artifact.analysis.student}</p>
                            <p><strong>Summary:</strong> {artifact.analysis.summary}</p>
                        </div>
                    )}

                    {/* Tags */}
                    {artifact.tags?.length > 0 && (
                        <div className="detail-section">
                            <h3>Tags</h3>
                            <div className="detail-tags">
                                {artifact.tags.map((tag, index) => (
                                    <span key={index} className="detail-tag">{tag}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Technical Metadata */}
                    <div className="detail-section metadata-section">
                        <h3>Technical Metadata</h3>
                        {artifact.uploader    && <p><strong>Uploaded By:</strong> {artifact.uploader}</p>}
                        {artifact.uploadDate  && (
                            <p>
                                <strong>Upload Date:</strong>{' '}
                                {new Date(artifact.uploadDate).toLocaleDateString('en-US', {
                                    year: 'numeric', month: 'long', day: 'numeric'
                                })}
                            </p>
                        )}
                        {artifact.fileType   && <p><strong>File Type:</strong> {artifact.fileType}</p>}
                        {artifact.fileSize   && <p><strong>File Size:</strong> {artifact.fileSize}</p>}
                        {artifact.dimensions && <p><strong>Image Dimensions:</strong> {artifact.dimensions}</p>}
                    </div>

                    {/* ── Admin-only sections below this line ─── */}

                    {/* Privacy Notes */}
                    {isAdmin && artifact.privacy?.notes && (
                        <div className="detail-section privacy-notes">
                            <h3>Privacy Notes</h3>
                            <p>{artifact.privacy.notes}</p>
                        </div>
                    )}

                    {/* Usage Permissions */}
                    {isAdmin && artifact.consent && (
                        <div className="detail-section">
                            <h3>Usage Permissions</h3>
                            <div className="permissions-grid">
                                <div className={`permission ${artifact.consent.permissions.archiveUse   ? 'allowed' : 'denied'}`}>
                                    {artifact.consent.permissions.archiveUse   ? '✓' : '✗'} Archive Use
                                </div>
                                <div className={`permission ${artifact.consent.permissions.classroomUse ? 'allowed' : 'denied'}`}>
                                    {artifact.consent.permissions.classroomUse ? '✓' : '✗'} Classroom Use
                                </div>
                                <div className={`permission ${artifact.consent.permissions.publicDisplay ? 'allowed' : 'denied'}`}>
                                    {artifact.consent.permissions.publicDisplay ? '✓' : '✗'} Public Display
                                </div>
                                <div className={`permission ${artifact.consent.permissions.commercialUse ? 'allowed' : 'denied'}`}>
                                    {artifact.consent.permissions.commercialUse ? '✓' : '✗'} Commercial Use
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

export default DetailPanel;
