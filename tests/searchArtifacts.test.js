import { describe, it, expect } from 'vitest'
import { matchesSearch, filterBySearch } from '../src/utils/searchArtifacts'

// ── Dummy artifact data ──────────────────────────────────────────────────────

const basketArtifact = {
  id: 1,
  title: 'Abenaki Sweetgrass Basket',
  tags: ['craftwork', 'daily life', 'Abenaki'],
  uploader: 'Jane Smith',
  uploadDate: '2024-01-15',
  fileType: 'image/jpeg',
  description: 'A traditional sweetgrass basket used for gathering produce.',
  context: 'Documented at the Burlington Farmers Market during fieldwork.',
  location: {
    place: 'Burlington Farmers Market',
    city: 'Burlington',
    state: 'Vermont',
    country: 'USA',
  },
  timePeriod: {
    created: 'Spring 2023',
    documented: 'January 2024',
    era: 'Contemporary',
  },
  subject: {
    name: 'Maria S.',
    isPseudonym: true,
    role: 'Artisan',
    community: 'Abenaki',
  },
  physicalDescription: {
    materials: 'Sweetgrass, ash wood splints',
    condition: 'Excellent',
  },
  transcript: 'Interviewer: "Can you tell me about this basket?" Maria: "It has been in my family for generations."',
}

const photoArtifact = {
  id: 2,
  title: 'Harvest Festival Photograph',
  tags: ['photography', 'community event', 'Vermont'],
  uploader: 'John Doe',
  uploadDate: '2023-09-10',
  fileType: 'image/png',
  description: 'Black-and-white photograph taken at the annual harvest festival.',
  context: 'Field documentation of community gathering in rural Vermont.',
  location: {
    place: 'Town Green',
    city: 'Montpelier',
    state: 'Vermont',
    country: 'USA',
  },
  timePeriod: {
    created: 'September 2023',
    documented: 'September 2023',
    era: 'Contemporary',
  },
  subject: {
    name: 'Community Members',
    isPseudonym: false,
    role: 'Event Participants',
    community: 'Rural Vermont',
  },
  physicalDescription: {
    materials: 'Digital file',
    condition: 'Excellent',
  },
  transcript: null,
}

const audioArtifact = {
  id: 3,
  title: 'Oral History Recording',
  tags: ['oral history', 'interview', 'language'],
  uploader: 'Alice Brown',
  uploadDate: '2022-06-01',
  fileType: 'audio/mp3',
  description: 'An oral history interview with an elder about traditional fishing practices.',
  context: 'Recorded at the subject\'s home in Rangeley, Maine.',
  location: {
    place: 'Private Residence',
    city: 'Rangeley',
    state: 'Maine',
    country: 'USA',
  },
  timePeriod: {
    created: 'June 2022',
    documented: 'June 2022',
    era: 'Contemporary',
  },
  subject: {
    name: 'Elder Thomas R.',
    isPseudonym: true,
    role: 'Knowledge Keeper',
    community: 'Wabanaki',
  },
  physicalDescription: {
    materials: 'Audio recording',
    condition: 'Good',
  },
  transcript: 'Thomas: "We always fished the same stretch of river. My grandfather taught me."',
}

const allArtifacts = [basketArtifact, photoArtifact, audioArtifact]

// ── matchesSearch ────────────────────────────────────────────────────────────

describe('matchesSearch', () => {
  it('returns true for empty query', () => {
    expect(matchesSearch(basketArtifact, '')).toBe(true)
  })

  it('returns true for whitespace-only query', () => {
    expect(matchesSearch(basketArtifact, '   ')).toBe(true)
  })

  it('returns true for null query', () => {
    expect(matchesSearch(basketArtifact, null)).toBe(true)
  })

  it('matches on title (case-insensitive)', () => {
    expect(matchesSearch(basketArtifact, 'sweetgrass')).toBe(true)
    expect(matchesSearch(basketArtifact, 'SWEETGRASS')).toBe(true)
    expect(matchesSearch(basketArtifact, 'SweetGrass')).toBe(true)
  })

  it('matches on description', () => {
    expect(matchesSearch(basketArtifact, 'gathering produce')).toBe(true)
  })

  it('matches on tag values', () => {
    expect(matchesSearch(basketArtifact, 'craftwork')).toBe(true)
    expect(matchesSearch(basketArtifact, 'daily life')).toBe(true)
  })

  it('matches on uploader name', () => {
    expect(matchesSearch(basketArtifact, 'Jane Smith')).toBe(true)
    expect(matchesSearch(basketArtifact, 'jane')).toBe(true)
  })

  it('matches on nested location fields', () => {
    expect(matchesSearch(basketArtifact, 'Burlington')).toBe(true)
    expect(matchesSearch(basketArtifact, 'Vermont')).toBe(true)
    expect(matchesSearch(basketArtifact, 'Farmers Market')).toBe(true)
  })

  it('matches on nested subject fields', () => {
    expect(matchesSearch(basketArtifact, 'Maria S.')).toBe(true)
    expect(matchesSearch(basketArtifact, 'Artisan')).toBe(true)
    expect(matchesSearch(basketArtifact, 'abenaki')).toBe(true)
  })

  it('matches on nested physicalDescription fields', () => {
    expect(matchesSearch(basketArtifact, 'ash wood')).toBe(true)
    expect(matchesSearch(basketArtifact, 'Excellent')).toBe(true)
  })

  it('matches on transcript text', () => {
    expect(matchesSearch(basketArtifact, 'generations')).toBe(true)
  })

  it('matches on context field', () => {
    expect(matchesSearch(basketArtifact, 'fieldwork')).toBe(true)
  })

  it('matches on fileType', () => {
    expect(matchesSearch(basketArtifact, 'jpeg')).toBe(true)
    expect(matchesSearch(audioArtifact, 'audio/mp3')).toBe(true)
  })

  it('returns false when query does not match any field', () => {
    expect(matchesSearch(basketArtifact, 'xyznotfound')).toBe(false)
  })

  it('does not match a partial overlap with incorrect casing that results in no match', () => {
    expect(matchesSearch(audioArtifact, 'zebra')).toBe(false)
  })

  it('handles null nested field values gracefully', () => {
    // photoArtifact.transcript is null — should not throw
    expect(() => matchesSearch(photoArtifact, 'something')).not.toThrow()
    expect(matchesSearch(photoArtifact, 'something')).toBe(false)
  })

  it('matches text in a null-containing transcript that is actually there', () => {
    // audioArtifact has a real transcript
    expect(matchesSearch(audioArtifact, 'grandfather')).toBe(true)
  })
})

// ── filterBySearch ───────────────────────────────────────────────────────────

describe('filterBySearch', () => {
  it('returns all artifacts when query is empty', () => {
    expect(filterBySearch(allArtifacts, '')).toEqual(allArtifacts)
  })

  it('returns all artifacts when query is null', () => {
    expect(filterBySearch(allArtifacts, null)).toEqual(allArtifacts)
  })

  it('returns only the basket artifact when searching "sweetgrass"', () => {
    const result = filterBySearch(allArtifacts, 'sweetgrass')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe(1)
  })

  it('returns only the photo artifact when searching "harvest festival"', () => {
    const result = filterBySearch(allArtifacts, 'harvest festival')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe(2)
  })

  it('returns only the audio artifact when searching "wabanaki"', () => {
    const result = filterBySearch(allArtifacts, 'wabanaki')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe(3)
  })

  it('returns multiple artifacts that share a matching field value', () => {
    // Both basket and photo have state: Vermont; audio has Maine
    const result = filterBySearch(allArtifacts, 'Vermont')
    expect(result).toHaveLength(2)
    expect(result.map(a => a.id)).toEqual(expect.arrayContaining([1, 2]))
  })

  it('returns multiple artifacts matching uploader partial name', () => {
    // Jane Smith (basket) and Alice Brown (audio) — "john" matches only photo
    const result = filterBySearch(allArtifacts, 'john')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe(2)
  })

  it('returns all artifacts matching "Contemporary" era', () => {
    const result = filterBySearch(allArtifacts, 'contemporary')
    expect(result).toHaveLength(3)
  })

  it('returns no artifacts when query matches nothing', () => {
    const result = filterBySearch(allArtifacts, 'zzznotexistent')
    expect(result).toHaveLength(0)
  })

  it('returns an empty array when input list is empty', () => {
    const result = filterBySearch([], 'sweetgrass')
    expect(result).toHaveLength(0)
  })

  it('matches across nested arrays (tags)', () => {
    const result = filterBySearch(allArtifacts, 'oral history')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe(3)
  })

  it('is case-insensitive', () => {
    const lower = filterBySearch(allArtifacts, 'rangeley')
    const upper = filterBySearch(allArtifacts, 'RANGELEY')
    const mixed = filterBySearch(allArtifacts, 'RaNgElEy')
    expect(lower).toEqual(upper)
    expect(lower).toEqual(mixed)
    expect(lower).toHaveLength(1)
    expect(lower[0].id).toBe(3)
  })
})
