export const CITATION_FORMATS = ['MLA', 'APA', 'Chicago']

const ARCHIVE_NAME = 'Leahy Center Digital Archive'

function getYear(uploadDate) {
  if (!uploadDate) return 'n.d.'
  const y = new Date(uploadDate).getFullYear()
  return isNaN(y) ? 'n.d.' : String(y)
}

// "Jane Smith" → "Smith, Jane."
function toApaAuthor(fullName) {
  if (!fullName) return ''
  const parts = fullName.trim().split(/\s+/)
  if (parts.length === 1) return `${parts[0]}.`
  const last  = parts[parts.length - 1]
  const first = parts.slice(0, -1).join(' ')
  return `${last}, ${first}.`
}

// Returns the subject name only when the subject exists and is not using a pseudonym.
function getSubjectName(artifact) {
  const s = artifact.subject
  if (!s || s.isPseudonym) return null
  return s.name || null
}

/**
 * Builds an academic citation string for an artifact.
 * @param {Object} artifact
 * @param {'MLA'|'APA'|'Chicago'} format
 * @returns {string}
 */
export function buildCitation(artifact, format) {
  if (!CITATION_FORMATS.includes(format)) {
    throw new Error(`Unsupported citation format: "${format}". Use one of: ${CITATION_FORMATS.join(', ')}.`)
  }

  const title    = artifact.title || 'Untitled'
  const author   = artifact.uploader || ''
  const year     = getYear(artifact.uploadDate)
  const subject  = getSubjectName(artifact)

  if (format === 'MLA') {
    // Author. "Title" [Subject]. Archive, Year.
    const parts = []
    if (author) parts.push(`${author}.`)
    const titlePart = subject
      ? `"${title}" (Subject: ${subject}).`
      : `"${title}".`
    parts.push(titlePart)
    parts.push(`${ARCHIVE_NAME},`)
    parts.push(`${year}.`)
    return parts.join(' ')
  }

  if (format === 'APA') {
    // Last, First. (Year). Title [Subject]. Archive.
    const apaAuthor = toApaAuthor(author)
    const parts = []
    if (apaAuthor) parts.push(apaAuthor)
    parts.push(`(${year}).`)
    const titlePart = subject ? `${title} (Subject: ${subject}).` : `${title}.`
    parts.push(titlePart)
    parts.push(`${ARCHIVE_NAME}.`)
    return parts.join(' ')
  }

  // Chicago
  // Author. "Title" [Subject]. Archive, Year.
  const parts = []
  if (author) parts.push(`${author}.`)
  const titlePart = subject
    ? `"${title}" (Subject: ${subject}).`
    : `"${title}".`
  parts.push(titlePart)
  parts.push(`${ARCHIVE_NAME},`)
  parts.push(`${year}.`)
  return parts.join(' ')
}
