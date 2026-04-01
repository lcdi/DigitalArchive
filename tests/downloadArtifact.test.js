import { describe, it, expect } from 'vitest'

// Pure filename generation logic extracted for testing
function buildFilename(artifact) {
  const extension = artifact.fileType.split('/')[1]
  const sanitizedTitle = artifact.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return `${sanitizedTitle}.${extension}`
}

describe('buildFilename', () => {
  it('generates a lowercase hyphenated filename from title and fileType', () => {
    const artifact = { title: 'Abenaki Sweetgrass Basket', fileType: 'image/jpeg' }
    expect(buildFilename(artifact)).toBe('abenaki-sweetgrass-basket.jpeg')
  })

  it('strips leading and trailing hyphens', () => {
    const artifact = { title: '---Cool Artifact---', fileType: 'image/png' }
    expect(buildFilename(artifact)).toBe('cool-artifact.png')
  })

  it('collapses multiple special characters into a single hyphen', () => {
    const artifact = { title: 'Title: Part 1 / Section 2', fileType: 'image/webp' }
    expect(buildFilename(artifact)).toBe('title-part-1-section-2.webp')
  })
})
