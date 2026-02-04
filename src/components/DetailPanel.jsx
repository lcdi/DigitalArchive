import './DetailPanel.css';
import { downloadArtifact } from '../utils/downloadArtifact.js';

function DetailPanel({ artifact, isOpen, onClose }) {
    if (!artifact) return null;

    const handleDownload = async () => {
        await downloadArtifact(artifact);
    };

    return (
        <div className={`detail-panel ${isOpen ? 'open' : ''}`}>
            <div className="detail-header">
                <h2>Artifact Details</h2>
                <button className="close-btn" onClick={onClose}>×</button>
            </div>

            <div className="detail-content">
                <div className="detail-image">
                    <img src={artifact.image} alt={artifact.title} />
                </div>

                <button
                    className="download-btn-detail"
                    onClick={handleDownload}
                    aria-label={`Download ${artifact.title}`}
                >
                    Download Artifact
                </button>

                <div className="detail-info">
                    {artifact.title && (
                        <div className="detail-section">
                            <h3>Title</h3>
                            <p>{artifact.title}</p>
                        </div>
                    )}

                    {artifact.description && (
                        <div className="detail-section">
                            <h3>Description</h3>
                            <p>{artifact.description}</p>
                        </div>
                    )}

                    {artifact.tags && artifact.tags.length > 0 && (
                        <div className="detail-section">
                            <h3>Tags</h3>
                            <div className="detail-tags">
                                {artifact.tags.map((tag, index) => (
                                    <span key={index} className="detail-tag">{tag}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {artifact.uploader && (
                        <div className="detail-section">
                            <h3>Uploaded By</h3>
                            <p>{artifact.uploader}</p>
                        </div>
                    )}

                    {artifact.uploadDate && (
                        <div className="detail-section">
                            <h3>Upload Date</h3>
                            <p>{new Date(artifact.uploadDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}</p>
                        </div>
                    )}

                    {artifact.fileType && (
                        <div className="detail-section">
                            <h3>File Type</h3>
                            <p>{artifact.fileType}</p>
                        </div>
                    )}

                    {artifact.fileSize && (
                        <div className="detail-section">
                            <h3>File Size</h3>
                            <p>{artifact.fileSize}</p>
                        </div>
                    )}

                    {artifact.dimensions && (
                        <div className="detail-section">
                            <h3>Dimensions</h3>
                            <p>{artifact.dimensions}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DetailPanel;