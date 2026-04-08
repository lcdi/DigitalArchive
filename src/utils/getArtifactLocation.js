/**
 * Parses a coordinate string of the form "44.4759° N, 73.2121° W" (or
 * equivalent without the degree symbol / with varying spacing) into a
 * [lat, lng] tuple.  Returns null if the string is absent or unparseable.
 */
export function parseCoordinates(coordStr) {
  if (!coordStr) return null
  const match = coordStr.match(/([0-9.]+)[°\s]*([NS]),\s*([0-9.]+)[°\s]*([EW])/i)
  if (!match) return null
  let lat = parseFloat(match[1])
  let lng = parseFloat(match[3])
  if (match[2].toUpperCase() === 'S') lat = -lat
  if (match[4].toUpperCase() === 'W') lng = -lng
  return [lat, lng]
}

/**
 * Returns the most specific location information available for an artifact,
 * in this priority order:
 *
 *   1. coordinates  – parseable lat/lng string  → { type: 'coordinates', coords: [lat, lng] }
 *   2. address      – street address             → { type: 'geocode', query: '…' }
 *   3. zip          – postal / zip code          → { type: 'geocode', query: '…' }
 *   4. place        – named place (market, etc.) → { type: 'geocode', query: '…' }
 *   5. city                                      → { type: 'geocode', query: '…' }
 *   6. state                                     → { type: 'geocode', query: '…' }
 *   7. country                                   → { type: 'geocode', query: '…' }
 *
 * Returns null if the artifact has no location object or all location fields
 * are empty/missing (i.e. the artifact should not be sent to Leaflet).
 *
 * The `query` for geocode results is built from the most-specific fields
 * available, joined with ", " so it can be passed directly to a geocoding
 * service (e.g. Nominatim).
 */
export function getArtifactLocation(artifact) {
  const loc = artifact?.location
  if (!loc) return null

  // 1. Exact coordinates – highest priority
  const coords = parseCoordinates(loc.coordinates)
  if (coords) return { type: 'coordinates', coords }

  // 2-7. Build a geocode query from the most-specific fields present
  const parts = [
    loc.address,
    loc.zip,
    loc.place,
    loc.city,
    loc.state,
    loc.country,
  ].filter(Boolean)

  if (parts.length === 0) return null

  return { type: 'geocode', query: parts.join(', ') }
}
