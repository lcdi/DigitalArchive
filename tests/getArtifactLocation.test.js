import { describe, it, expect } from 'vitest'
import { parseCoordinates, getArtifactLocation } from '../src/utils/getArtifactLocation'

// ── parseCoordinates ─────────────────────────────────────────────────────────

describe('parseCoordinates', () => {
  // ── Valid inputs ─────────────────────────────────────────────────────────

  it('parses a standard degree-symbol coordinate string (N, W)', () => {
    const result = parseCoordinates('44.4759° N, 73.2121° W')
    expect(result).toEqual([44.4759, -73.2121])
  })

  it('parses a coordinate string without degree symbols', () => {
    const result = parseCoordinates('44.4759 N, 73.2121 W')
    expect(result).toEqual([44.4759, -73.2121])
  })

  it('returns a positive longitude for East', () => {
    const result = parseCoordinates('48.8530° N, 2.3499° E')
    expect(result).toEqual([48.853, 2.3499])
  })

  it('returns a negative latitude for South', () => {
    const result = parseCoordinates('33.8688° S, 151.2093° E')
    expect(result).toEqual([-33.8688, 151.2093])
  })

  it('returns negative lat and positive lng for South + East', () => {
    const result = parseCoordinates('1.3521° S, 103.8198° E')
    expect(result).toEqual([-1.3521, 103.8198])
  })

  it('returns negative lat and negative lng for South + West', () => {
    const result = parseCoordinates('23.5505° S, 46.6333° W')
    expect(result).toEqual([-23.5505, -46.6333])
  })

  it('is case-insensitive for N/S/E/W', () => {
    expect(parseCoordinates('44.4759° n, 73.2121° w')).toEqual([44.4759, -73.2121])
    expect(parseCoordinates('44.4759° N, 73.2121° w')).toEqual([44.4759, -73.2121])
  })

  it('returns an array with exactly two elements', () => {
    const result = parseCoordinates('0° N, 0° E')
    expect(result).toHaveLength(2)
  })

  it('handles zero coordinates (equator / prime meridian)', () => {
    expect(parseCoordinates('0° N, 0° E')).toEqual([0, 0])
  })

  // ── Invalid / absent inputs ────────────────────────────────────────────

  it('returns null for an empty string', () => {
    expect(parseCoordinates('')).toBeNull()
  })

  it('returns null for null', () => {
    expect(parseCoordinates(null)).toBeNull()
  })

  it('returns null for undefined', () => {
    expect(parseCoordinates(undefined)).toBeNull()
  })

  it('returns null for a plain address string', () => {
    expect(parseCoordinates('123 Main St, Burlington, VT')).toBeNull()
  })

  it('returns null for a string with only numbers and no N/S/E/W', () => {
    expect(parseCoordinates('44.4759, 73.2121')).toBeNull()
  })

  it('returns null for a partial coordinate string', () => {
    expect(parseCoordinates('44.4759° N')).toBeNull()
  })
})

// ── getArtifactLocation ──────────────────────────────────────────────────────

// ── No location data → null ──────────────────────────────────────────────────

describe('getArtifactLocation — no location', () => {
  it('returns null when the artifact has no location property', () => {
    expect(getArtifactLocation({ id: 1, title: 'No Location' })).toBeNull()
  })

  it('returns null when location is null', () => {
    expect(getArtifactLocation({ location: null })).toBeNull()
  })

  it('returns null when location is an empty object', () => {
    expect(getArtifactLocation({ location: {} })).toBeNull()
  })

  it('returns null when location has only undefined/empty fields', () => {
    expect(getArtifactLocation({ location: { city: '', state: undefined, country: null } })).toBeNull()
  })

  it('returns null when the artifact itself is null', () => {
    expect(getArtifactLocation(null)).toBeNull()
  })
})

// ── Coordinates (highest priority) ──────────────────────────────────────────

describe('getArtifactLocation — coordinates', () => {
  it('returns { type: "coordinates" } when a parseable coordinates string is present', () => {
    const artifact = { location: { coordinates: '44.4759° N, 73.2121° W' } }
    const result = getArtifactLocation(artifact)
    expect(result).toEqual({ type: 'coordinates', coords: [44.4759, -73.2121] })
  })

  it('prefers coordinates over all other location fields', () => {
    const artifact = {
      location: {
        coordinates: '48.8530° N, 2.3499° E',
        address: '6 Parvis Notre-Dame',
        city: 'Paris',
        country: 'France',
      },
    }
    const result = getArtifactLocation(artifact)
    expect(result?.type).toBe('coordinates')
    expect(result?.coords).toEqual([48.853, 2.3499])
  })

  it('falls through when coordinates string is present but unparseable', () => {
    const artifact = { location: { coordinates: 'near the old church', city: 'Burlington' } }
    const result = getArtifactLocation(artifact)
    // coordinates is unparseable so should fall back to geocode
    expect(result?.type).toBe('geocode')
  })
})

// ── Geocode fallback chain ───────────────────────────────────────────────────

describe('getArtifactLocation — geocode fallback chain', () => {
  it('returns a geocode result when only an address is present', () => {
    const artifact = { location: { address: '123 Church Street' } }
    const result = getArtifactLocation(artifact)
    expect(result).toEqual({ type: 'geocode', query: '123 Church Street' })
  })

  it('returns a geocode result when only a zip code is present', () => {
    const artifact = { location: { zip: '05401' } }
    const result = getArtifactLocation(artifact)
    expect(result).toEqual({ type: 'geocode', query: '05401' })
  })

  it('returns a geocode result when only a place name is present', () => {
    const artifact = { location: { place: 'Burlington Farmers Market' } }
    const result = getArtifactLocation(artifact)
    expect(result).toEqual({ type: 'geocode', query: 'Burlington Farmers Market' })
  })

  it('returns a geocode result when only a city is present', () => {
    const artifact = { location: { city: 'Burlington' } }
    const result = getArtifactLocation(artifact)
    expect(result).toEqual({ type: 'geocode', query: 'Burlington' })
  })

  it('returns a geocode result when only a state is present', () => {
    const artifact = { location: { state: 'Vermont' } }
    const result = getArtifactLocation(artifact)
    expect(result).toEqual({ type: 'geocode', query: 'Vermont' })
  })

  it('returns a geocode result when only a country is present', () => {
    const artifact = { location: { country: 'France' } }
    const result = getArtifactLocation(artifact)
    expect(result).toEqual({ type: 'geocode', query: 'France' })
  })

  // ── Query construction: most specific fields first ────────────────────────

  it('builds the query from all available fields in priority order', () => {
    const artifact = {
      location: {
        address: '6 Parvis Notre-Dame',
        city: 'Paris',
        state: 'Île-de-France',
        country: 'France',
      },
    }
    const result = getArtifactLocation(artifact)
    expect(result?.type).toBe('geocode')
    expect(result?.query).toBe('6 Parvis Notre-Dame, Paris, Île-de-France, France')
  })

  it('includes zip in the query when present alongside city and state', () => {
    const artifact = { location: { zip: '05401', city: 'Burlington', state: 'Vermont' } }
    const result = getArtifactLocation(artifact)
    expect(result?.query).toBe('05401, Burlington, Vermont')
  })

  it('includes place in the query when present alongside city and country', () => {
    const artifact = {
      location: { place: 'Burlington Farmers Market', city: 'Burlington', country: 'USA' },
    }
    const result = getArtifactLocation(artifact)
    expect(result?.query).toBe('Burlington Farmers Market, Burlington, USA')
  })

  it('omits missing fields from the query (no trailing commas / gaps)', () => {
    // No address, no zip, no place
    const artifact = { location: { city: 'Rangeley', country: 'USA' } }
    const result = getArtifactLocation(artifact)
    expect(result?.query).toBe('Rangeley, USA')
  })

  it('includes all six possible fields when all are present', () => {
    const artifact = {
      location: {
        address: '1 Main St',
        zip: '05401',
        place: 'Town Hall',
        city: 'Burlington',
        state: 'Vermont',
        country: 'USA',
      },
    }
    const result = getArtifactLocation(artifact)
    expect(result?.query).toBe('1 Main St, 05401, Town Hall, Burlington, Vermont, USA')
  })
})

// ── Priority: more specific beats less specific ───────────────────────────────

describe('getArtifactLocation — specificity priority', () => {
  it('address + city produces a query that starts with the address', () => {
    const artifact = { location: { address: '1 Church St', city: 'Burlington' } }
    const result = getArtifactLocation(artifact)
    expect(result?.query.startsWith('1 Church St')).toBe(true)
  })

  it('zip + state produces a query that starts with the zip', () => {
    const artifact = { location: { zip: '05401', state: 'Vermont' } }
    const result = getArtifactLocation(artifact)
    expect(result?.query.startsWith('05401')).toBe(true)
  })

  it('city + country produces a query that starts with the city', () => {
    const artifact = { location: { city: 'Montpelier', country: 'USA' } }
    const result = getArtifactLocation(artifact)
    expect(result?.query.startsWith('Montpelier')).toBe(true)
  })
})
