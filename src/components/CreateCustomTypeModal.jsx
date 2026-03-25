import { useState } from 'react';
import './AddArtifactModal.css';

const SECTION_OPTIONS = [
    {
        key: 'showTranscript',
        label: 'Transcript / Field Notes',
        description: 'Interview transcript or field notes field',
        fieldsKey: null,
        fields: null,
    },
    {
        key: 'showLocation',
        label: 'Location',
        description: 'Place, city, state, country, GPS coordinates',
        fieldsKey: 'location',
        fields: [
            { key: 'place', label: 'Specific Place' },
            { key: 'city', label: 'City' },
            { key: 'state', label: 'State / Province' },
            { key: 'country', label: 'Country' },
            { key: 'coordinates', label: 'GPS Coordinates' },
        ],
    },
    {
        key: 'showHistoricalEra',
        label: 'Historical Era / Period',
        description: 'Historical era / period field',
        fieldsKey: null,
        fields: null,
    },
    {
        key: 'showSubject',
        label: 'Subject (Who)',
        description: 'Subject name, role, community fields',
        fieldsKey: 'subject',
        fields: [
            { key: 'name', label: 'Subject Name' },
            { key: 'isPseudonym', label: 'Pseudonym Toggle' },
            { key: 'role', label: 'Role / Occupation' },
            { key: 'community', label: 'Community / Group' },
        ],
    },
    {
        key: 'showPhysical',
        label: 'Physical Details',
        description: 'Materials, dimensions, weight, condition',
        fieldsKey: 'physicalDescription',
        fields: [
            { key: 'materials', label: 'Materials' },
            { key: 'dimensions', label: 'Physical Dimensions' },
            { key: 'weight', label: 'Weight' },
            { key: 'condition', label: 'Condition' },
        ],
    },
    {
        key: 'showStudentAnalysis',
        label: 'Student Analysis',
        description: 'Course, student name, analysis summary',
        fieldsKey: 'analysis',
        fields: [
            { key: 'course', label: 'Course' },
            { key: 'student', label: 'Student Name' },
            { key: 'summary', label: 'Analysis Summary' },
        ],
    },
];

const DEFAULT_SECTIONS = {
    showTranscript: true,
    showLocation: true,
    showHistoricalEra: true,
    showSubject: true,
    showPhysical: true,
    showStudentAnalysis: true,
};

const DEFAULT_FIELDS = {
    location: { place: true, city: true, state: true, country: true, coordinates: true },
    subject: { name: true, isPseudonym: true, role: true, community: true },
    physicalDescription: { materials: true, dimensions: true, weight: true, condition: true },
    analysis: { course: true, student: true, summary: true },
};

function CreateCustomTypeModal({ isOpen, onClose, onSave }) {
    const [name, setName] = useState('');
    const [sections, setSections] = useState({ ...DEFAULT_SECTIONS });
    const [fields, setFields] = useState(JSON.parse(JSON.stringify(DEFAULT_FIELDS)));
    const [expandedSections, setExpandedSections] = useState(new Set());

    const handleSectionToggle = (key, e) => {
        e.stopPropagation();
        setSections(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleExpandToggle = (key) => {
        setExpandedSections(prev => {
            const next = new Set(prev);
            next.has(key) ? next.delete(key) : next.add(key);
            return next;
        });
    };

    const handleFieldToggle = (fieldsKey, fieldKey, e) => {
        e.stopPropagation();
        setFields(prev => ({
            ...prev,
            [fieldsKey]: {
                ...prev[fieldsKey],
                [fieldKey]: !prev[fieldsKey][fieldKey],
            },
        }));
    };

    const handleSave = () => {
        if (!name.trim()) return;
        onSave({
            id: `custom_${Date.now()}`,
            name: name.trim(),
            rules: { ...sections },
            fields: JSON.parse(JSON.stringify(fields)),
        });
        setName('');
        setSections({ ...DEFAULT_SECTIONS });
        setFields(JSON.parse(JSON.stringify(DEFAULT_FIELDS)));
        setExpandedSections(new Set());
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay custom-type-overlay">
            <div className="modal-container custom-type-modal">
                <div className="modal-header">
                    <h2>Create Custom Type</h2>
                    <button className="modal-close-btn" onClick={onClose}>×</button>
                </div>

                <div className="modal-content">
                    <p className="custom-type-description">
                        Define a new artifact type with a name and choose which optional sections
                        and individual fields to include. Basic Info, Context, Time Period,
                        Meaning, and Privacy &amp; Consent are always included.
                    </p>

                    <div className="form-group">
                        <label>Type Name *</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Audio Recording, Map, Field Sketch"
                            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                        />
                    </div>

                    <div className="custom-type-sections">
                        <span className="sections-label">Optional Sections</span>

                        {SECTION_OPTIONS.map(({ key, label, description, fieldsKey, fields: sectionFields }) => {
                            const isOn = sections[key];
                            const isExpanded = expandedSections.has(key);
                            const hasSubFields = sectionFields !== null;

                            return (
                                <div key={key} className="section-block">
                                    <div
                                        className={`section-toggle-row${isOn ? ' enabled' : ''}${hasSubFields && isExpanded ? ' expanded-open' : ''}`}
                                        onClick={hasSubFields ? () => handleExpandToggle(key) : undefined}
                                        style={!hasSubFields ? { cursor: 'default' } : undefined}
                                    >
                                        <div className="section-toggle-info">
                                            <span className="section-toggle-label">{label}</span>
                                            <span className="section-toggle-desc">{description}</span>
                                        </div>
                                        <div className="section-toggle-actions">
                                            {hasSubFields && (
                                                <span className={`expand-chevron${isExpanded ? ' open' : ''}`}>
                                                    ▾
                                                </span>
                                            )}
                                            <div
                                                className={`toggle-switch${isOn ? ' on' : ' off'}`}
                                                onClick={(e) => handleSectionToggle(key, e)}
                                            >
                                                <div className="toggle-knob" />
                                            </div>
                                        </div>
                                    </div>

                                    {hasSubFields && isExpanded && (
                                        <div className="section-subfields">
                                            {sectionFields.map(({ key: fieldKey, label: fieldLabel }) => {
                                                const fieldOn = fields[fieldsKey]?.[fieldKey] !== false;
                                                return (
                                                    <div
                                                        key={fieldKey}
                                                        className={`subfield-toggle-row${fieldOn ? ' enabled' : ''}${!isOn ? ' dimmed' : ''}`}
                                                        onClick={isOn ? (e) => handleFieldToggle(fieldsKey, fieldKey, e) : undefined}
                                                        style={!isOn ? { cursor: 'not-allowed' } : undefined}
                                                    >
                                                        <span className="subfield-label">{fieldLabel}</span>
                                                        <div className={`toggle-switch toggle-switch-sm${fieldOn && isOn ? ' on' : ' off'}`}>
                                                            <div className="toggle-knob" />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn-secondary" onClick={onClose}>Cancel</button>
                    <button
                        className="btn-primary"
                        onClick={handleSave}
                        disabled={!name.trim()}
                    >
                        Create Type
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreateCustomTypeModal;
