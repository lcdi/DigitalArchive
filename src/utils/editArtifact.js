/**
 * Returns a new artifact with the given patch applied.
 * Top-level primitive/array fields are replaced directly.
 * Top-level plain-object fields are shallow-merged so sibling keys are preserved.
 * The original artifact is never mutated.
 */
export function applyArtifactEdit(artifact, patch) {
  const result = { ...artifact }

  for (const key of Object.keys(patch)) {
    const patchVal = patch[key]
    const origVal  = artifact[key]

    if (
      patchVal !== null &&
      typeof patchVal === 'object' &&
      !Array.isArray(patchVal) &&
      origVal  !== null &&
      typeof origVal  === 'object' &&
      !Array.isArray(origVal)
    ) {
      result[key] = { ...origVal, ...patchVal }
    } else {
      result[key] = patchVal
    }
  }

  return result
}

/**
 * Validates an artifact (or a patched artifact) before saving.
 * Returns { valid: boolean, errors: string[] } where each entry in errors
 * is the field name that failed validation.
 */
export function validateArtifactEdit(artifact) {
  const errors = []

  if (!artifact.title || !artifact.title.trim()) {
    errors.push('title')
  }

  return { valid: errors.length === 0, errors }
}
