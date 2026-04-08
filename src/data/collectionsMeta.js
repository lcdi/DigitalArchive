/**
 * Metadata for named collections/archives.
 *
 * Keys must match the collection ID used in the app — for tag-derived collections,
 * this is the FIRST TAG on the artifacts in that collection.
 * For manually created collections, this is the `id` you assign them.
 *
 * isPrivate: true  → only admins can view. Unauthenticated users see "Access Denied".
 * isPrivate: false → anyone with the share link can view (default).
 */
export const collectionsMeta = {
  // Vermont Field Research — artifacts documented in the Greater Burlington, VT area
  'vermont-field-research': {
    label: 'Vermont Field Research',
    description: 'Ethnographic fieldwork conducted across the Greater Burlington, Vermont area, documenting regional cultural practices, diaspora communities, indigenous traditions, and material culture.',
    isPrivate: false,
  },
  // Global Ethnographic Archive — international fieldwork across multiple continents
  'global-ethnography': {
    label: 'Global Ethnographic Archive',
    description: 'International ethnographic documentation spanning multiple continents — capturing diverse cultural practices, oral traditions, ritual life, and community knowledge from field researchers worldwide.',
    isPrivate: false,
  },
}

/**
 * Helper — returns true if this collection is private.
 * Falls back to false (public) for unknown/unregistered IDs.
 */
export function isCollectionPrivate(collectionId) {
  return collectionsMeta[collectionId]?.isPrivate === true
}

