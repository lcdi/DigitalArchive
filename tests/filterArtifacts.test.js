import { describe, it, expect } from 'vitest'
import { applyFilters } from '../src/utils/filterArtifacts'

// ── Shared test fixtures ────────────────────────────────────────────────────

const emptyFilters = {
  tags: [],
  fileTypes: [],
  uploaders: [],
  dateRange: { start: '', end: '' },
  searchQuery: '',
}

const basketArtifact = {
  id: 1,
  title: 'Abenaki Sweetgrass Basket',
  tags: ['craftwork', 'daily life', 'Abenaki'],
  uploader: 'Jane Smith',
  uploadDate: '2024-01-15',
  fileType: 'image/jpeg',
  description: 'A traditional sweetgrass basket.',
  location: { city: 'Burlington', state: 'Vermont', country: 'USA' },
}

const photoArtifact = {
  id: 2,
  title: 'Harvest Festival Photograph',
  tags: ['photography', 'community event', 'Vermont'],
  uploader: 'John Doe',
  uploadDate: '2023-09-10',
  fileType: 'image/png',
  description: 'Black-and-white photograph at the annual harvest festival.',
  location: { city: 'Montpelier', state: 'Vermont', country: 'USA' },
}

const audioArtifact = {
  id: 3,
  title: 'Oral History Recording',
  tags: ['oral history', 'interview', 'language'],
  uploader: 'Alice Brown',
  uploadDate: '2022-06-01',
  fileType: 'audio/mp3',
  description: 'An oral history interview with an elder.',
  location: { city: 'Rangeley', state: 'Maine', country: 'USA' },
}

const videoArtifact = {
  id: 4,
  title: 'Weaving Demonstration Video',
  tags: ['craftwork', 'video', 'demonstration'],
  uploader: 'Jane Smith',
  uploadDate: '2023-03-20',
  fileType: 'video/mp4',
  description: 'A recorded weaving demonstration.',
  location: { city: 'Burlington', state: 'Vermont', country: 'USA' },
}

const allArtifacts = [basketArtifact, photoArtifact, audioArtifact, videoArtifact]

// ── No filters ───────────────────────────────────────────────────────────────

describe('applyFilters — no active filters', () => {
  it('returns all artifacts when filters are empty', () => {
    expect(applyFilters(allArtifacts, emptyFilters)).toEqual(allArtifacts)
  })

  it('returns an empty array when the input list is empty', () => {
    expect(applyFilters([], emptyFilters)).toEqual([])
  })
})

// ── Tag filtering ────────────────────────────────────────────────────────────

describe('applyFilters — tags', () => {
  it('returns only artifacts that have at least one of the selected tags', () => {
    const result = applyFilters(allArtifacts, { ...emptyFilters, tags: ['craftwork'] })
    expect(result.map(a => a.id)).toEqual([1, 4])
  })

  it('returns artifacts matching ANY of multiple selected tags (OR within tags)', () => {
    const result = applyFilters(allArtifacts, { ...emptyFilters, tags: ['oral history', 'photography'] })
    expect(result.map(a => a.id)).toEqual(expect.arrayContaining([2, 3]))
    expect(result).toHaveLength(2)
  })

  it('returns no artifacts when the tag matches nothing', () => {
    const result = applyFilters(allArtifacts, { ...emptyFilters, tags: ['nonexistent-tag'] })
    expect(result).toHaveLength(0)
  })

  it('is case-sensitive for tag matching (tags are stored as-is)', () => {
    // tags are stored lowercase; 'Craftwork' should not match 'craftwork'
    const result = applyFilters(allArtifacts, { ...emptyFilters, tags: ['Craftwork'] })
    expect(result).toHaveLength(0)
  })
})

// ── File-type filtering ──────────────────────────────────────────────────────

describe('applyFilters — fileTypes', () => {
  it('returns only artifacts of the selected file type', () => {
    const result = applyFilters(allArtifacts, { ...emptyFilters, fileTypes: ['image/jpeg'] })
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe(1)
  })

  it('returns artifacts matching ANY of multiple selected file types', () => {
    const result = applyFilters(allArtifacts, { ...emptyFilters, fileTypes: ['image/png', 'audio/mp3'] })
    expect(result.map(a => a.id)).toEqual(expect.arrayContaining([2, 3]))
    expect(result).toHaveLength(2)
  })

  it('returns no artifacts when no file type matches', () => {
    const result = applyFilters(allArtifacts, { ...emptyFilters, fileTypes: ['application/pdf'] })
    expect(result).toHaveLength(0)
  })

  it('requires full MIME type match, not partial', () => {
    const result = applyFilters(allArtifacts, { ...emptyFilters, fileTypes: ['image'] })
    expect(result).toHaveLength(0)
  })
})

// ── Uploader filtering ───────────────────────────────────────────────────────

describe('applyFilters — uploaders', () => {
  it('returns only artifacts from the selected uploader', () => {
    const result = applyFilters(allArtifacts, { ...emptyFilters, uploaders: ['Jane Smith'] })
    expect(result.map(a => a.id)).toEqual(expect.arrayContaining([1, 4]))
    expect(result).toHaveLength(2)
  })

  it('returns artifacts from ANY of multiple selected uploaders', () => {
    const result = applyFilters(allArtifacts, { ...emptyFilters, uploaders: ['John Doe', 'Alice Brown'] })
    expect(result.map(a => a.id)).toEqual(expect.arrayContaining([2, 3]))
    expect(result).toHaveLength(2)
  })

  it('returns no artifacts when uploader does not match', () => {
    const result = applyFilters(allArtifacts, { ...emptyFilters, uploaders: ['Unknown Person'] })
    expect(result).toHaveLength(0)
  })
})

// ── Date-range filtering ─────────────────────────────────────────────────────

describe('applyFilters — dateRange', () => {
  it('filters by start date only — excludes artifacts before the start', () => {
    const result = applyFilters(allArtifacts, {
      ...emptyFilters,
      dateRange: { start: '2024-01-01', end: '' },
    })
    // Only basketArtifact (2024-01-15) is on or after 2024-01-01
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe(1)
  })

  it('filters by end date only — excludes artifacts after the end', () => {
    const result = applyFilters(allArtifacts, {
      ...emptyFilters,
      dateRange: { start: '', end: '2022-12-31' },
    })
    // Only audioArtifact (2022-06-01) is on or before 2022-12-31
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe(3)
  })

  it('filters by both start and end — returns artifacts within the range (inclusive)', () => {
    const result = applyFilters(allArtifacts, {
      ...emptyFilters,
      dateRange: { start: '2023-01-01', end: '2023-12-31' },
    })
    // photoArtifact (2023-09-10) and videoArtifact (2023-03-20) are within 2023
    expect(result.map(a => a.id)).toEqual(expect.arrayContaining([2, 4]))
    expect(result).toHaveLength(2)
  })

  it('returns an artifact whose uploadDate exactly equals the start boundary', () => {
    const result = applyFilters(allArtifacts, {
      ...emptyFilters,
      dateRange: { start: '2024-01-15', end: '' },
    })
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe(1)
  })

  it('returns an artifact whose uploadDate exactly equals the end boundary', () => {
    const result = applyFilters(allArtifacts, {
      ...emptyFilters,
      dateRange: { start: '', end: '2022-06-01' },
    })
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe(3)
  })

  it('returns no artifacts when date range excludes everything', () => {
    const result = applyFilters(allArtifacts, {
      ...emptyFilters,
      dateRange: { start: '2025-01-01', end: '2025-12-31' },
    })
    expect(result).toHaveLength(0)
  })
})

// ── Search-query filtering ───────────────────────────────────────────────────

describe('applyFilters — searchQuery', () => {
  it('returns all artifacts when searchQuery is empty', () => {
    expect(applyFilters(allArtifacts, { ...emptyFilters, searchQuery: '' })).toHaveLength(4)
  })

  it('filters by searchQuery matching the title', () => {
    const result = applyFilters(allArtifacts, { ...emptyFilters, searchQuery: 'sweetgrass' })
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe(1)
  })

  it('searchQuery is case-insensitive', () => {
    const lower = applyFilters(allArtifacts, { ...emptyFilters, searchQuery: 'oral history' })
    const upper = applyFilters(allArtifacts, { ...emptyFilters, searchQuery: 'ORAL HISTORY' })
    expect(lower).toEqual(upper)
    expect(lower).toHaveLength(1)
  })

  it('returns no artifacts when searchQuery matches nothing', () => {
    const result = applyFilters(allArtifacts, { ...emptyFilters, searchQuery: 'zzznotfound' })
    expect(result).toHaveLength(0)
  })
})

// ── Combined filters (AND across categories) ─────────────────────────────────

describe('applyFilters — combined filters', () => {
  it('ANDs tag and fileType filters', () => {
    // craftwork tag → ids 1, 4; image/jpeg fileType → id 1 only
    const result = applyFilters(allArtifacts, {
      ...emptyFilters,
      tags: ['craftwork'],
      fileTypes: ['image/jpeg'],
    })
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe(1)
  })

  it('ANDs uploader and tag filters', () => {
    // Jane Smith → ids 1, 4; photography tag → id 2 only; intersection is empty
    const result = applyFilters(allArtifacts, {
      ...emptyFilters,
      uploaders: ['Jane Smith'],
      tags: ['photography'],
    })
    expect(result).toHaveLength(0)
  })

  it('ANDs uploader filter and date range', () => {
    // Jane Smith → ids 1 (2024-01-15) and 4 (2023-03-20); date range 2023 → id 4 only
    const result = applyFilters(allArtifacts, {
      ...emptyFilters,
      uploaders: ['Jane Smith'],
      dateRange: { start: '2023-01-01', end: '2023-12-31' },
    })
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe(4)
  })

  it('ANDs all filter types together', () => {
    const result = applyFilters(allArtifacts, {
      tags: ['craftwork'],
      fileTypes: ['video/mp4'],
      uploaders: ['Jane Smith'],
      dateRange: { start: '2023-01-01', end: '2023-12-31' },
      searchQuery: 'weaving',
    })
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe(4)
  })

  it('returns empty when combined filters have no intersection', () => {
    const result = applyFilters(allArtifacts, {
      ...emptyFilters,
      tags: ['craftwork'],
      uploaders: ['Alice Brown'], // Alice Brown only uploaded the audio artifact (oral history tag)
    })
    expect(result).toHaveLength(0)
  })
})
