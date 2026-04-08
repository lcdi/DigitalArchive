// Adrian Bassir

// All six optional sections are turned on by default when creating a new custom type
const DEFAULT_SECTIONS = {
    showTranscript: true,
    showLocation: true,
    showHistoricalEra: true,
    showSubject: true,
    showPhysical: true,
    showStudentAnalysis: true,
};

// All individual fields within each section are also on by default
const DEFAULT_FIELDS = {
    location: { place: true, city: true, state: true, country: true, coordinates: true },
    subject: { name: true, isPseudonym: true, role: true, community: true },
    physicalDescription: { materials: true, dimensions: true, weight: true, condition: true },
    analysis: { course: true, student: true, summary: true },
};

// Builds a custom type object ready to be saved.
// Returns null if the name is blank, a type needs a real name.
export function buildCustomType(name, sections = DEFAULT_SECTIONS, fields = DEFAULT_FIELDS) {
    if (!name || !name.trim()) return null;

    return {
        id: `custom_${Date.now()}`, // unique ID based on the current timestamp
        name: name.trim(), // strip any accidental leading/trailing spaces
        rules: { ...sections }, // shallow copy so the original sections object is not changed
        fields: JSON.parse(JSON.stringify(fields)), // deep copy so nested field objects are not shared
    };
}
