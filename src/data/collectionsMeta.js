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
  // Derived from artifacts with first tag "craftwork" — public archive
  'craftwork': {
    label: 'Craftwork & Material Culture',
    description: 'Documented material artifacts including traditional crafts, tools, and everyday objects from field research.',
    isPrivate: false,
  },
  // Derived from artifacts with first tag "historical" — restricted archive
  'historical': {
    label: 'Historical Documentation',
    description: 'Archival photographs and field notes from historical site documentation. Contains sensitive pre-event records.',
    isPrivate: true,
  },
}

/**
 * Helper — returns true if this collection is private.
 * Falls back to false (public) for unknown/unregistered IDs.
 */
export function isCollectionPrivate(collectionId) {
  return collectionsMeta[collectionId]?.isPrivate === true
}

