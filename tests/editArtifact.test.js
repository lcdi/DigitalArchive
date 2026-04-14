import { describe, it, expect } from 'vitest'
import { applyArtifactEdit, validateArtifactEdit } from '../src/utils/editArtifact'

// ── Shared baseline artifact ─────────────────────────────────────────────────

const original = {
  id: 1,
  title: 'Abenaki Sweetgrass Basket',
  uploader: 'Jane Smith',
  uploadDate: '2024-01-15',
  fileType: 'image/jpeg',
  description: 'A traditional sweetgrass basket used for gathering produce.',
  context: 'Documented at the Burlington Farmers Market during fieldwork.',
  tags: ['craftwork', 'daily life', 'Abenaki'],
  subject: {
    name: 'Maria S.',
    isPseudonym: true,
    role: 'Artisan',
    community: 'Abenaki',
  },
  location: {
    place: 'Burlington Farmers Market',
    city: 'Burlington',
    state: 'Vermont',
    country: 'USA',
    coordinates: '44.4759,-73.2121',
  },
  timePeriod: {
    created: 'Spring 2023',
    documented: 'January 2024',
    era: 'Contemporary',
  },
  physicalDescription: {
    materials: 'Sweetgrass, ash wood splints',
    condition: 'Excellent',
    dimensions: '12" x 8" x 6"',
    weight: '0.5 lbs',
  },
  privacy: {
    level: 'Restricted',
    publicAccess: false,
    identityProtected: true,
    notes: 'Consent form on file.',
  },
  consent: {
    formSigned: true,
    dateSigned: '2024-01-10',
    irbApproved: true,
    irbNumber: 'IRB-2024-001',
  },
}

// ── applyArtifactEdit — top-level field changes ──────────────────────────────

describe('applyArtifactEdit - top-level fields', () => {
  it('updates a top-level string field', () => {
    const result = applyArtifactEdit(original, { title: 'Edited Basket' })
    expect(result.title).toBe('Edited Basket')
  })

  it('updates a top-level array field', () => {
    const result = applyArtifactEdit(original, { tags: ['craftwork', 'heritage'] })
    expect(result.tags).toEqual(['craftwork', 'heritage'])
  })

  it('preserves fields not included in the patch', () => {
    const result = applyArtifactEdit(original, { title: 'Edited Basket' })
    expect(result.description).toBe(original.description)
    expect(result.uploader).toBe(original.uploader)
    expect(result.fileType).toBe(original.fileType)
  })

  it('preserves the artifact id', () => {
    const result = applyArtifactEdit(original, { title: 'New Title' })
    expect(result.id).toBe(original.id)
  })
})

// ── applyArtifactEdit — nested object changes ────────────────────────────────

describe('applyArtifactEdit - nested objects', () => {
  it('merges a partial subject update without losing sibling keys', () => {
    const result = applyArtifactEdit(original, {
      subject: { role: 'Elder' },
    })
    expect(result.subject.role).toBe('Elder')
    expect(result.subject.name).toBe(original.subject.name)
    expect(result.subject.isPseudonym).toBe(original.subject.isPseudonym)
    expect(result.subject.community).toBe(original.subject.community)
  })

  it('merges a partial location update without losing sibling keys', () => {
    const result = applyArtifactEdit(original, {
      location: { city: 'Winooski' },
    })
    expect(result.location.city).toBe('Winooski')
    expect(result.location.state).toBe(original.location.state)
    expect(result.location.country).toBe(original.location.country)
    expect(result.location.coordinates).toBe(original.location.coordinates)
  })

  it('merges a partial timePeriod update', () => {
    const result = applyArtifactEdit(original, {
      timePeriod: { era: 'Historical' },
    })
    expect(result.timePeriod.era).toBe('Historical')
    expect(result.timePeriod.created).toBe(original.timePeriod.created)
    expect(result.timePeriod.documented).toBe(original.timePeriod.documented)
  })

  it('merges a partial physicalDescription update', () => {
    const result = applyArtifactEdit(original, {
      physicalDescription: { condition: 'Good' },
    })
    expect(result.physicalDescription.condition).toBe('Good')
    expect(result.physicalDescription.materials).toBe(original.physicalDescription.materials)
  })
})

// ── applyArtifactEdit — immutability ─────────────────────────────────────────

describe('applyArtifactEdit - immutability', () => {
  it('does not mutate the original artifact', () => {
    const originalTitle = original.title
    applyArtifactEdit(original, { title: 'Something Else' })
    expect(original.title).toBe(originalTitle)
  })

  it('does not mutate the original nested subject object', () => {
    const originalRole = original.subject.role
    applyArtifactEdit(original, { subject: { role: 'Changed' } })
    expect(original.subject.role).toBe(originalRole)
  })

  it('returns a new object reference', () => {
    const result = applyArtifactEdit(original, { title: 'New Title' })
    expect(result).not.toBe(original)
  })
})

// ── applyArtifactEdit — empty patch ──────────────────────────────────────────

describe('applyArtifactEdit - empty patch', () => {
  it('returns an object equal in value to the original when the patch is empty', () => {
    const result = applyArtifactEdit(original, {})
    expect(result).toEqual(original)
  })

  it('still returns a new object reference for an empty patch', () => {
    const result = applyArtifactEdit(original, {})
    expect(result).not.toBe(original)
  })
})

// ── validateArtifactEdit ─────────────────────────────────────────────────────

describe('validateArtifactEdit - required fields', () => {
  // Title is always required; clearing it should fail validation
  it('returns invalid when title is cleared', () => {
    const result = validateArtifactEdit({ ...original, title: '' })
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('title')
  })

  it('returns invalid when title is whitespace only', () => {
    const result = validateArtifactEdit({ ...original, title: '   ' })
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('title')
  })

  it('returns valid when title is a non-empty string', () => {
    const result = validateArtifactEdit({ ...original, title: 'Valid Title' })
    expect(result.valid).toBe(true)
    expect(result.errors).not.toContain('title')
  })
})

describe('validateArtifactEdit - optional fields', () => {
  // Fields like description and context are optional; omitting them should not fail
  it('returns valid when description is absent', () => {
    const { description, ...withoutDescription } = original
    const result = validateArtifactEdit(withoutDescription)
    expect(result.valid).toBe(true)
  })

  it('returns valid when tags array is empty', () => {
    const result = validateArtifactEdit({ ...original, tags: [] })
    expect(result.valid).toBe(true)
  })
})

describe('validateArtifactEdit - return shape', () => {
  it('always returns an object with a boolean valid and an errors array', () => {
    const result = validateArtifactEdit(original)
    expect(typeof result.valid).toBe('boolean')
    expect(Array.isArray(result.errors)).toBe(true)
  })

  it('returns an empty errors array for a fully valid artifact', () => {
    const result = validateArtifactEdit(original)
    expect(result.errors).toHaveLength(0)
  })
})
