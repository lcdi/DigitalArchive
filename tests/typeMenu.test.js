// Adrian Bassir
import { describe, it, expect } from 'vitest'
import { getTypeRules, DEFAULT_TYPES } from '../src/utils/typeRules.js'

// Tests for the type dropdown menu

describe('DEFAULT_TYPES', () => {
    // Make sure the list of built-in types has not accidentally changed
    it('contains the five built-in artifact types', () => {
        expect(DEFAULT_TYPES).toEqual(['Photo', 'Interview', 'Document', 'Object', 'Student Work'])
    })
})

// Each built-in type should show the right sections in the form

describe('getTypeRules - built-in types', () => {
    // The transcript section only makes sense for an interview recording
    it('shows transcript only for Interview', () => {
        expect(getTypeRules('Interview').showTranscript).toBe(true)
        expect(getTypeRules('Photo').showTranscript).toBe(false)
    })

    // Location is useful for photos, interviews, and physical objects but not documents
    it('shows location for Photo, Interview, and Object', () => {
        expect(getTypeRules('Photo').showLocation).toBe(true)
        expect(getTypeRules('Interview').showLocation).toBe(true)
        expect(getTypeRules('Object').showLocation).toBe(true)
        expect(getTypeRules('Document').showLocation).toBe(false)
    })

    // Historical era is relevant when cataloguing old documents or objects
    it('shows historicalEra for Document and Object only', () => {
        expect(getTypeRules('Document').showHistoricalEra).toBe(true)
        expect(getTypeRules('Object').showHistoricalEra).toBe(true)
        expect(getTypeRules('Photo').showHistoricalEra).toBe(false)
    })

    // Subject (who the artifact is about) applies to photos and interviews
    it('shows subject for Photo and Interview only', () => {
        expect(getTypeRules('Photo').showSubject).toBe(true)
        expect(getTypeRules('Interview').showSubject).toBe(true)
        expect(getTypeRules('Document').showSubject).toBe(false)
    })

    // Student analysis is always shown, every artifact can have student work attached
    it('always shows student analysis regardless of type', () => {
        DEFAULT_TYPES.forEach(type => {
            expect(getTypeRules(type).showStudentAnalysis).toBe(true)
        })
    })
})

// Switching types should give back different rules

describe('getTypeRules - switching types', () => {
    // Changing from Photo to Document should flip location off and historical era on
    it('returns different rules when type changes from Photo to Document', () => {
        const photoRules = getTypeRules('Photo')
        const documentRules = getTypeRules('Document')
        expect(photoRules.showLocation).toBe(true)
        expect(documentRules.showLocation).toBe(false)
        expect(photoRules.showHistoricalEra).toBe(false)
        expect(documentRules.showHistoricalEra).toBe(true)
    })

    // Changing from Interview to Object should remove transcript and subject sections
    it('returns different rules when type changes from Interview to Object', () => {
        const interviewRules = getTypeRules('Interview')
        const objectRules = getTypeRules('Object')
        expect(interviewRules.showTranscript).toBe(true)
        expect(objectRules.showTranscript).toBe(false)
        expect(interviewRules.showSubject).toBe(true)
        expect(objectRules.showSubject).toBe(false)
    })
})

// Custom types should appear in the menu and use their own saved rules

describe('getTypeRules - custom types in the menu', () => {
    // When the user picks a custom type, its saved rules should be used instead of the defaults
    it('uses the custom type rules when a matching custom type is found', () => {
        const customTypes = [{
            id: 'custom_1',
            name: 'Map',
            rules: {
                showTranscript: false,
                showLocation: true,
                showHistoricalEra: true,
                showSubject: false,
                showPhysical: false,
                showStudentAnalysis: false,
            },
        }]
        const rules = getTypeRules('Map', customTypes)
        expect(rules.showLocation).toBe(true)
        expect(rules.showHistoricalEra).toBe(true)
        expect(rules.showSubject).toBe(false)
        expect(rules.showStudentAnalysis).toBe(false)
    })

    // If no custom type matches, we should still get sensible built-in rules
    it('falls back to built-in rules when no matching custom type exists', () => {
        const rules = getTypeRules('Photo', [])
        expect(rules.showLocation).toBe(true)
        expect(rules.showSubject).toBe(true)
    })
})
