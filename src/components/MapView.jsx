import { useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './MapView.css'
import { getArtifactLocation } from '../utils/getArtifactLocation'

// Branded SVG pin icon using app color palette
function makeIcon() {
  return L.divIcon({
    html: `<svg viewBox="0 0 24 36" xmlns="http://www.w3.org/2000/svg" width="24" height="36">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 24 12 24S24 21 24 12C24 5.373 18.627 0 12 0z"
            fill="#00A9E0" stroke="#003C5F" stroke-width="1.5"/>
      <circle cx="12" cy="12" r="4.5" fill="white"/>
    </svg>`,
    className: '',
    iconSize: [24, 36],
    iconAnchor: [12, 36],
    tooltipAnchor: [0, -38],
  })
}

const pinIcon = makeIcon()


function ArtifactTooltipContent({ artifact }) {
  const loc = artifact.location
  const locationText = [loc?.place, loc?.city, loc?.country].filter(Boolean).join(', ')

  return (
    <div className="map-tooltip-card">
      {artifact.image && (
        <img src={artifact.image} alt={artifact.title} className="map-tooltip-img" />
      )}
      <div className="map-tooltip-body">
        <div className="map-tooltip-title">{artifact.title}</div>
        {artifact.subject?.name && (
          <div className="map-tooltip-subject">
            {artifact.subject.name}
            {artifact.subject.isPseudonym && <span className="map-tooltip-pseudonym"> (pseudonym)</span>}
          </div>
        )}
        {locationText && (
          <div className="map-tooltip-location">
            <span className="map-tooltip-location-icon">📍</span> {locationText}
          </div>
        )}
        {artifact.tags?.length > 0 && (
          <div className="map-tooltip-tags">
            {artifact.tags.slice(0, 3).map(tag => (
              <span key={tag} className="map-tooltip-tag">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function MapView({ artifacts, onArtifactClick }) {
  const pinned = useMemo(() =>
    artifacts
      .map(a => ({ artifact: a, location: getArtifactLocation(a) }))
      .filter(({ location }) => location?.type === 'coordinates'),
    [artifacts]
  )

  const center = useMemo(() => {
    if (pinned.length === 0) return [20, 0]
    return [
      pinned.reduce((s, { location }) => s + location.coords[0], 0) / pinned.length,
      pinned.reduce((s, { location }) => s + location.coords[1], 0) / pinned.length,
    ]
  }, [pinned])

  const zoom = pinned.length > 0 ? 5 : 2

  return (
    <div className="map-view-container">
      <MapContainer center={center} zoom={zoom} className="map-leaflet">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {pinned.map(({ artifact, location }) => (
          <Marker
            key={artifact.id}
            position={location.coords}
            icon={pinIcon}
            eventHandlers={{ click: () => onArtifactClick(artifact) }}
          >
            <Tooltip direction="top" offset={[0, 0]} opacity={1} className="map-tooltip">
              <ArtifactTooltipContent artifact={artifact} />
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>

      {pinned.length === 0 && (
        <div className="map-no-pins">
          <p>No artifacts in this collection have location coordinates.</p>
        </div>
      )}
    </div>
  )
}
