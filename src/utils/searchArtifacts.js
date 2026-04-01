/**
 * Recursively checks whether any string value inside `node` contains `query`.
 * Handles strings, numbers, arrays, and plain objects.
 */
function containsQuery(node, query) {
  if (node === null || node === undefined) return false
  if (typeof node === 'string') return node.toLowerCase().includes(query)
  if (typeof node === 'number') return String(node).includes(query)
  if (Array.isArray(node)) return node.some(v => containsQuery(v, query))
  if (typeof node === 'object') return Object.values(node).some(v => containsQuery(v, query))
  return false
}

/**
 * Returns true if the artifact matches the search query across all its fields.
 * Returns true if query is empty or whitespace-only.
 */
export function matchesSearch(artifact, query) {
  if (!query || !query.trim()) return true
  return containsQuery(artifact, query.trim().toLowerCase())
}

/**
 * Filters an array of artifacts by a search query.
 */
export function filterBySearch(artifacts, query) {
  if (!query || !query.trim()) return artifacts
  return artifacts.filter(a => matchesSearch(a, query))
}
