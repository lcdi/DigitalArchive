import { useState, useMemo } from 'react'
import './TimelineView.css'

export default function TimelineView({ artifacts, onArtifactClick }) {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // Filter artifacts within the date range and sort by uploadDate
  const timelineArtifacts = useMemo(() => {
    let filtered = artifacts

    if (startDate || endDate) {
      filtered = artifacts.filter(artifact => {
        const artifactDate = new Date(artifact.uploadDate)
        const start = startDate ? new Date(startDate) : null
        const end = endDate ? new Date(endDate) : null

        if (start && artifactDate < start) return false
        if (end && artifactDate > end) return false
        return true
      })
    }

    // Sort by uploadDate chronologically (oldest first)
    return filtered.sort((a, b) => new Date(a.uploadDate) - new Date(b.uploadDate))
  }, [artifacts, startDate, endDate])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const clearDates = () => {
    setStartDate('')
    setEndDate('')
  }

  return (
    <div className="timeline-view">
      <div className="timeline-controls">
        <div className="timeline-date-inputs">
          <div className="date-input-group">
            <label htmlFor="timeline-start">From:</label>
            <input
              id="timeline-start"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="timeline-date-input"
            />
          </div>
          <div className="date-input-group">
            <label htmlFor="timeline-end">To:</label>
            <input
              id="timeline-end"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="timeline-date-input"
            />
          </div>
          {(startDate || endDate) && (
            <button
              className="timeline-clear-btn"
              onClick={clearDates}
              aria-label="Clear date range"
            >
              Clear
            </button>
          )}
        </div>
        <div className="timeline-summary">
          {timelineArtifacts.length} artifact{timelineArtifacts.length !== 1 ? 's' : ''} in timeline
        </div>
      </div>

      <div className="timeline-content">
        {timelineArtifacts.length === 0 ? (
          <div className="timeline-empty">
            <p>No artifacts found in the selected date range.</p>
            {(startDate || endDate) && (
              <p>Try adjusting your date filters or clearing them to see all artifacts.</p>
            )}
          </div>
        ) : (
          <div className="timeline-list">
            {timelineArtifacts.map((artifact, index) => (
              <div key={artifact.id} className="timeline-item">
                <div className="timeline-connector">
                  <div className="timeline-dot"></div>
                  {index < timelineArtifacts.length - 1 && <div className="timeline-line"></div>}
                </div>
                <div className="timeline-card" onClick={() => onArtifactClick(artifact)}>
                  <div className="timeline-date">
                    {formatDate(artifact.uploadDate)}
                  </div>
                  <div className="timeline-artifact">
                    <div className="timeline-image">
                      <img src={artifact.image} alt={artifact.title} />
                    </div>
                    <div className="timeline-info">
                      <h3 className="timeline-title">{artifact.title}</h3>
                      {artifact.subject?.name && (
                        <p className="timeline-subject">
                          {artifact.subject.name}
                          {artifact.subject.isPseudonym && <span className="timeline-pseudonym">*</span>}
                        </p>
                      )}
                      {artifact.location?.city && (
                        <p className="timeline-location">
                          📍 {artifact.location.city}, {artifact.location.state}
                        </p>
                      )}
                      {artifact.tags?.length > 0 && (
                        <div className="timeline-tags">
                          {artifact.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="timeline-tag">{tag}</span>
                          ))}
                          {artifact.tags.length > 3 && (
                            <span className="timeline-tag timeline-tag-more">
                              +{artifact.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}