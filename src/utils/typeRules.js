// Adrian Bassir

// The five artifact types that are always available in the type dropdown
export const DEFAULT_TYPES = ['Photo', 'Interview', 'Document', 'Object', 'Student Work'];

// Returns an object saying which sections should be visible for a given type.
// If the type is a custom one the user created, we use its saved rules.
// Otherwise we fall back to the built-in rules below.
export function getTypeRules(type, customTypes = []) {
    // Check if the selected type matches any custom type the user made
    const matched = customTypes.find(ct => ct.name === type);
    if (matched) return matched.rules;

    // Built-in rules, each line controls one section in the artifact form
    return {
        showTranscript: type === 'Interview', // only interviews have a transcript
        showLocation: ['Photo', 'Interview', 'Object'].includes(type), // where it was found/taken
        showHistoricalEra: ['Document', 'Object'].includes(type), // historical context for older items
        showSubject: ['Photo', 'Interview'].includes(type), // who the artifact is about
        showPhysical: ['Photo', 'Document', 'Object'].includes(type), // materials, size, condition, etc.
        showStudentAnalysis: true, // always shown for every type
    };
}
