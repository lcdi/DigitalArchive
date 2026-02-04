import './ArtifactCard.css';
import { downloadArtifact } from '../utils/downloadArtifact.js';

function ArtifactCard({ artifact, onClick }) {
    const handleDownload = async (e) => {
        e.stopPropagation(); // Prevent card click when downloading
        await downloadArtifact(artifact);
    };

    return (
        <div className="artifact-card" onClick={() => onClick(artifact)}>
            <div className="artifact-image">
                <img src={artifact.image} alt={artifact.title} />
            </div>
            <div className="artifact-info">
                <div className="artifact-header">
                    <h3>{artifact.title}</h3>
                    <button
                        className="download-btn-card"
                        onClick={handleDownload}
                        aria-label={`Download ${artifact.title}`}
                    >
                        Download
                    </button>
                </div>
                {artifact.tags && artifact.tags.length > 0 && (
                    <div className="artifact-tags">
                        {artifact.tags.map((tag, index) => (
                            <span key={index} className="tag">{tag}</span>
                        ))}
                    </div>
                )}
                {artifact.uploader && (
                    <p className="artifact-meta">Uploaded by: {artifact.uploader}</p>
                )}
                {artifact.uploadDate && (
                    <p className="artifact-meta">Date: {new Date(artifact.uploadDate).toLocaleDateString()}</p>
                )}
            </div>
        </div>
    );
}

export default ArtifactCard;