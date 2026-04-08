import { matchesSearch } from './searchArtifacts'

/**
 * Applies all active filters to an array of artifacts.
 * Each filter category is AND-ed together; within a category the match is OR-ed.
 *
 * @param {Object[]} artifacts
 * @param {{ tags: string[], fileTypes: string[], uploaders: string[], dateRange: { start: string, end: string }, searchQuery: string }} filters
 * @returns {Object[]}
 */
export function applyFilters(artifacts, filters) {
  return artifacts.filter(artifact => {
    if (filters.tags.length > 0) {
      if (!artifact.tags.some(tag => filters.tags.includes(tag))) return false
    }
    if (filters.fileTypes.length > 0) {
      if (!filters.fileTypes.includes(artifact.fileType)) return false
    }
    if (filters.uploaders.length > 0) {
      if (!filters.uploaders.includes(artifact.uploader)) return false
    }
    if (filters.dateRange.start || filters.dateRange.end) {
      const artifactDate = new Date(artifact.uploadDate)
      if (filters.dateRange.start && artifactDate < new Date(filters.dateRange.start)) return false
      if (filters.dateRange.end   && artifactDate > new Date(filters.dateRange.end))   return false
    }
    if (!matchesSearch(artifact, filters.searchQuery)) return false
    return true
  })
}
