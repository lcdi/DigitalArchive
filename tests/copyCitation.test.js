import { describe, it, expect } from 'vitest'
import { buildCitation, CITATION_FORMATS } from '../src/utils/buildCitation'

// ── Shared test artifact ─────────────────────────────────────────────────────

const fullArtifact = {
  id: 1,
  title: 'Abenaki Sweetgrass Basket',
  uploader: 'Jane Smith',
  uploadDate: '2024-01-15',
  fileType: 'image/jpeg',
  context: 'Documented at the Burlington Farmers Market during fieldwork.',
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
  },
  timePeriod: {
    created: 'Spring 2023',
    documented: 'January 2024',
    era: 'Contemporary',
  },
  privacy: {
    level: 'Restricted',
    publicAccess: false,
    identityProtected: true,
  },
}

// ── CITATION_FORMATS constant ────────────────────────────────────────────────

describe('CITATION_FORMATS', () => {
  it('exports the three supported format strings', () => {
    expect(CITATION_FORMATS).toContain('MLA')
    expect(CITATION_FORMATS).toContain('APA')
    expect(CITATION_FORMATS).toContain('Chicago')
  })
})

// ── MLA format ───────────────────────────────────────────────────────────────

describe('buildCitation - MLA', () => {
  it('includes the artifact title in quotes', () => {
    const citation = buildCitation(fullArtifact, 'MLA')
    expect(citation).toContain('"Abenaki Sweetgrass Basket"')
  })

  it('includes the uploader as author', () => {
    const citation = buildCitation(fullArtifact, 'MLA')
    expect(citation).toContain('Jane Smith')
  })

  it('includes the upload year', () => {
    const citation = buildCitation(fullArtifact, 'MLA')
    expect(citation).toContain('2024')
  })

  it('includes the collection name or archive label', () => {
    const citation = buildCitation(fullArtifact, 'MLA')
    // The citation should name the archive/repository
    expect(citation).toMatch(/Leahy Center|Digital Archive|Backstory/i)
  })

  it('returns a non-empty string', () => {
    const citation = buildCitation(fullArtifact, 'MLA')
    expect(typeof citation).toBe('string')
    expect(citation.length).toBeGreaterThan(0)
  })
})

// ── APA format ───────────────────────────────────────────────────────────────

describe('buildCitation - APA', () => {
  it('places the year in parentheses after the author', () => {
    const citation = buildCitation(fullArtifact, 'APA')
    // APA: Author (Year). Title...
    expect(citation).toMatch(/Smith.*\(2024\)/i)
  })

  it('includes the artifact title', () => {
    const citation = buildCitation(fullArtifact, 'APA')
    expect(citation).toContain('Abenaki Sweetgrass Basket')
  })

  it('includes the upload year', () => {
    const citation = buildCitation(fullArtifact, 'APA')
    expect(citation).toContain('2024')
  })

  it('includes the archive/repository name', () => {
    const citation = buildCitation(fullArtifact, 'APA')
    expect(citation).toMatch(/Leahy Center|Digital Archive|Backstory/i)
  })

  it('returns a non-empty string', () => {
    const citation = buildCitation(fullArtifact, 'APA')
    expect(typeof citation).toBe('string')
    expect(citation.length).toBeGreaterThan(0)
  })
})

// ── Chicago format ───────────────────────────────────────────────────────────

describe('buildCitation - Chicago', () => {
  it('includes the uploader name', () => {
    const citation = buildCitation(fullArtifact, 'Chicago')
    expect(citation).toContain('Jane Smith')
  })

  it('includes the artifact title in quotes', () => {
    const citation = buildCitation(fullArtifact, 'Chicago')
    expect(citation).toContain('"Abenaki Sweetgrass Basket"')
  })

  it('includes the upload year', () => {
    const citation = buildCitation(fullArtifact, 'Chicago')
    expect(citation).toContain('2024')
  })

  it('includes the archive/repository name', () => {
    const citation = buildCitation(fullArtifact, 'Chicago')
    expect(citation).toMatch(/Leahy Center|Digital Archive|Backstory/i)
  })

  it('returns a non-empty string', () => {
    const citation = buildCitation(fullArtifact, 'Chicago')
    expect(typeof citation).toBe('string')
    expect(citation.length).toBeGreaterThan(0)
  })
})

// ── Edge cases ───────────────────────────────────────────────────────────────

describe('buildCitation - missing fields', () => {
  // Uploader is sometimes absent; the citation should not break or include "undefined"
  it('handles a missing uploader without including "undefined"', () => {
    const artifact = { ...fullArtifact, uploader: undefined }
    CITATION_FORMATS.forEach(format => {
      const citation = buildCitation(artifact, format)
      expect(citation).not.toContain('undefined')
    })
  })

  // Upload date may not be present for older records
  it('handles a missing uploadDate without including "undefined"', () => {
    const artifact = { ...fullArtifact, uploadDate: undefined }
    CITATION_FORMATS.forEach(format => {
      const citation = buildCitation(artifact, format)
      expect(citation).not.toContain('undefined')
    })
  })

  // An artifact always has a title; the citation should still be usable
  it('handles a minimal artifact with only a title', () => {
    const minimalArtifact = { title: 'Unknown Artifact' }
    CITATION_FORMATS.forEach(format => {
      const citation = buildCitation(minimalArtifact, format)
      expect(citation).toContain('Unknown Artifact')
      expect(citation).not.toContain('undefined')
    })
  })

  // Passing an unknown format should throw a clear error
  it('throws for an unrecognised format string', () => {
    expect(() => buildCitation(fullArtifact, 'Harvard')).toThrow()
  })
})

// ── Pseudonym / privacy handling ─────────────────────────────────────────────

describe('buildCitation - pseudonym awareness', () => {
  // When the subject uses a pseudonym, the citation should not expose the protected name;
  // the subject name on a citation (as opposed to the uploader) should be omitted or
  // replaced so that identity-protected individuals are not inadvertently identified.
  it('does not include a pseudonymous subject name in any format', () => {
    // fullArtifact.subject.name is 'Maria S.' with isPseudonym: true
    CITATION_FORMATS.forEach(format => {
      const citation = buildCitation(fullArtifact, format)
      expect(citation).not.toContain('Maria S.')
    })
  })

  // Non-pseudonymous subjects may be cited normally
  it('may include a non-pseudonymous subject name', () => {
    const artifact = {
      ...fullArtifact,
      subject: { ...fullArtifact.subject, isPseudonym: false, name: 'John Running Bear' },
    }
    // At least one format should surface the name (exact behaviour is implementation-defined,
    // but the name must not be suppressed when no privacy protection applies)
    const citations = CITATION_FORMATS.map(f => buildCitation(artifact, f))
    const anyIncludesName = citations.some(c => c.includes('John Running Bear'))
    expect(anyIncludesName).toBe(true)
  })
})
