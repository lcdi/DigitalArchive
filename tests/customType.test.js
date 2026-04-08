// Adrian Bassir
import { describe, it, expect } from 'vitest'
import { buildCustomType } from '../src/utils/buildCustomType.js'

// Tests for creating a custom artifact type

describe('buildCustomType - validation', () => {
    // An empty string is not a usable type name
    it('returns null when name is empty', () => {
        expect(buildCustomType('')).toBeNull()
    })

    // Spaces only is the same as no name, the form requires something real
    it('returns null when name is only whitespace', () => {
        expect(buildCustomType('   ')).toBeNull()
    })
})

// The created type object should have the right shape

describe('buildCustomType - output shape', () => {
    // Each custom type gets a unique ID so it can be stored and looked up later
    it('creates a type object with an id starting with "custom_"', () => {
        const type = buildCustomType('Audio Recording')
        expect(type.id).toMatch(/^custom_\d+$/)
    })

    // Extra spaces around the name (e.g. from copy-paste) should be cleaned up
    it('trims whitespace from the name', () => {
        const type = buildCustomType('  Field Sketch  ')
        expect(type.name).toBe('Field Sketch')
    })

    // Every custom type needs both a rules object (which sections show) and a fields object (which fields show)
    it('includes a rules object and a fields object', () => {
        const type = buildCustomType('Map')
        expect(type).toHaveProperty('rules')
        expect(type).toHaveProperty('fields')
    })
})

// Default sections and fields should all be on unless the user changes them

describe('buildCustomType - default sections', () => {
    // When no sections are passed in, every section should be enabled
    it('enables all six sections by default', () => {
        const type = buildCustomType('Map')
        expect(type.rules.showTranscript).toBe(true)
        expect(type.rules.showLocation).toBe(true)
        expect(type.rules.showHistoricalEra).toBe(true)
        expect(type.rules.showSubject).toBe(true)
        expect(type.rules.showPhysical).toBe(true)
        expect(type.rules.showStudentAnalysis).toBe(true)
    })

    // When no fields are passed in, every individual field should also be enabled
    it('enables all default fields', () => {
        const type = buildCustomType('Map')
        expect(type.fields.location.city).toBe(true)
        expect(type.fields.subject.name).toBe(true)
        expect(type.fields.physicalDescription.materials).toBe(true)
        expect(type.fields.analysis.summary).toBe(true)
    })
})

// Custom section and field choices should be saved correctly

describe('buildCustomType - custom sections and fields', () => {
    // The user can turn sections off and those choices should show up in the saved type
    it('respects custom section toggles', () => {
        const sections = {
            showTranscript: false,
            showLocation: true,
            showHistoricalEra: false,
            showSubject: false,
            showPhysical: true,
            showStudentAnalysis: false,
        }
        const type = buildCustomType('Sketch', sections)
        expect(type.rules.showLocation).toBe(true)
        expect(type.rules.showTranscript).toBe(false)
        expect(type.rules.showSubject).toBe(false)
    })

    // Individual fields within a section can also be toggled and those choices should stick too
    it('reflects custom field toggles in the output', () => {
        const fields = {
            location: { place: true, city: false, state: true, country: true, coordinates: false },
            subject: { name: true, isPseudonym: false, role: true, community: true },
            physicalDescription: { materials: true, dimensions: true, weight: false, condition: true },
            analysis: { course: true, student: false, summary: true },
        }
        const type = buildCustomType('Field Sketch', undefined, fields)
        expect(type.fields.location.city).toBe(false)
        expect(type.fields.location.place).toBe(true)
        expect(type.fields.analysis.student).toBe(false)
    })

    // The returned type should be its own copy, changing it later should not affect the original fields object
    it('does not mutate the fields argument passed in', () => {
        const fields = {
            location: { place: true, city: true, state: true, country: true, coordinates: true },
            subject: { name: true, isPseudonym: true, role: true, community: true },
            physicalDescription: { materials: true, dimensions: true, weight: true, condition: true },
            analysis: { course: true, student: true, summary: true },
        }
        const type = buildCustomType('Clone Check', undefined, fields)
        // Mutate the returned copy and check the original is untouched
        type.fields.location.city = false
        expect(fields.location.city).toBe(true)
    })
})
