import { useState, useEffect } from 'react';
import './AddArtifactModal.css';

function AddArtifactModal({ isOpen, onClose, onSave, collections = [], targetCollectionId = null }) {
    const [currentStepKey, setCurrentStepKey] = useState('basic');
    const [formData, setFormData] = useState({
        // Basic Info
        title: '',
        type: '',
        image: null,
        imagePreview: '',
        tags: [],
        tagInput: '',
        uploader: '',
        fileType: '',
        fileSize: '',
        dimensions: '',
        collectionId: null,
        
        // Context & Description
        context: '',
        description: '',
        
        // Location (Where)
        location: {
            place: '',
            city: '',
            state: '',
            country: '',
            coordinates: ''
        },
        
        // Time Period (When)
        timePeriod: {
            created: '',
            documented: '',
            era: ''
        },
        
        // Subject (Who)
        subject: {
            name: '',
            isPseudonym: false,
            role: '',
            community: ''
        },
        
        // Physical Description
        physicalDescription: {
            materials: '',
            dimensions: '',
            condition: '',
            weight: ''
        },
        
        // Function & Meaning
        function: '',
        meaning: '',
        
        // Transcript
        transcript: '',
        
        // Additional Media
        additionalMedia: [],
        
        // Analysis
        analysis: {
            hasStudentWork: false,
            course: '',
            student: '',
            summary: ''
        },
        
        // Privacy
        privacy: {
            level: 'Public Domain',
            publicAccess: true,
            identityProtected: false,
            notes: ''
        },
        
        // Consent
        consent: {
            formSigned: false,
            dateSigned: '',
            permissions: {
                archiveUse: true,
                classroomUse: true,
                publicDisplay: true,
                commercialUse: false
            },
            irbApproved: false,
            irbNumber: '',
            irbDate: ''
        }
    });

    useEffect(() => {
        if (isOpen) {
            setFormData(prev => ({ ...prev, collectionId: targetCollectionId || null }));
        }
    }, [isOpen, targetCollectionId]);

    const rules = {
        showTranscript: formData.type === 'Interview',
        showLocation: ['Photo', 'Interview', 'Object'].includes(formData.type),
        showHistoricalEra: ['Document', 'Object'].includes(formData.type),
        showSubject: ['Photo', 'Interview'].includes(formData.type),
        showPhysical: ['Photo', 'Document', 'Object'].includes(formData.type),
        showStudentAnalysis: formData.type === 'Student Work',
    };

    const ALL_STEPS = [
        { key: 'basic', title: 'Basic Info', icon: '📄' },
        { key: 'context', title: 'Context', icon: '📝' },
        { key: 'location', title: 'Location', icon: '📍' },
        { key: 'timeSubject', title: 'Time & Subject', icon: '👤' },
        { key: 'physical', title: 'Physical Details', icon: '🔬' },
        { key: 'meaning', title: 'Meaning', icon: '💭' },
        { key: 'privacy', title: 'Privacy & Consent', icon: '🔒' }
    ];

    const visibleSteps = ALL_STEPS.filter(step => {
        if (step.key === 'location') return rules.showLocation;
        if (step.key === 'physical') return rules.showPhysical;
        return true;
    });

    const currentIndex = visibleSteps.findIndex(s => s.key === currentStepKey);

    useEffect(() => {
    const stillVisible = visibleSteps.some(s => s.key === currentStepKey);
    if (!stillVisible) {
        setCurrentStepKey(visibleSteps[0]?.key ?? 'basic');
    }
    }, [visibleSteps, currentStepKey]);
    
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleNestedChange = (category, field, value) => {
        setFormData(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [field]: value
            }
        }));
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    image: file,
                    imagePreview: reader.result,
                    fileType: file.type,
                    fileSize: (file.size / 1024 / 1024).toFixed(2) + ' MB'
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddTag = () => {
        if (formData.tagInput.trim()) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, prev.tagInput.trim()],
                tagInput: ''
            }));
        }
    };

    const handleRemoveTag = (indexToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter((_, index) => index !== indexToRemove)
        }));
    };

    const handleNext = () => {
    if (currentIndex < visibleSteps.length - 1) {
        setCurrentStepKey(visibleSteps[currentIndex + 1].key);
    }
    };

    const handlePrevious = () => {
    if (currentIndex > 0) {
        setCurrentStepKey(visibleSteps[currentIndex - 1].key);
    }
    };

    const handleSubmit = () => {
        // Create artifact object
        const newArtifact = {
            id: Date.now(),
            title: formData.title,
            type: formData.type,
            image: formData.imagePreview, // In production, this would be uploaded to server
            collectionId: formData.collectionId || null,
            tags: formData.tags,
            uploader: formData.uploader || 'Current User',
            uploadDate: new Date().toISOString().split('T')[0],
            fileType: formData.fileType,
            fileSize: formData.fileSize,
            dimensions: formData.dimensions,
            context: formData.context,
            location: formData.location,
            timePeriod: formData.timePeriod,
            subject: formData.subject,
            description: formData.description,
            physicalDescription: formData.physicalDescription,
            function: formData.function,
            meaning: formData.meaning,
            transcript: formData.transcript,
            additionalMedia: formData.additionalMedia,
            analysis: formData.analysis,
            privacy: formData.privacy,
            consent: formData.consent
        };

        onSave(newArtifact);
        handleClose();
    };

    const handleClose = () => {
        setCurrentStepKey('basic');
        setFormData({
            title: '',
            type: '',
            image: null,
            imagePreview: '',
            tags: [],
            tagInput: '',
            uploader: '',
            fileType: '',
            fileSize: '',
            dimensions: '',
            collectionId: null,
            context: '',
            description: '',
            location: { place: '', city: '', state: '', country: '', coordinates: '' },
            timePeriod: { created: '', documented: '', era: '' },
            subject: { name: '', isPseudonym: false, role: '', community: '' },
            physicalDescription: { materials: '', dimensions: '', condition: '', weight: '' },
            function: '',
            meaning: '',
            transcript: '',
            additionalMedia: [],
            analysis: { hasStudentWork: false, course: '', student: '', summary: '' },
            privacy: { level: 'Public Domain', publicAccess: true, identityProtected: false, notes: '' },
            consent: {
                formSigned: false,
                dateSigned: '',
                permissions: { archiveUse: true, classroomUse: true, publicDisplay: true, commercialUse: false },
                irbApproved: false,
                irbNumber: '',
                irbDate: ''
            }
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h2>Add New Artifact</h2>
                    <button className="modal-close-btn" onClick={handleClose}>×</button>
                </div>

                {/* Progress Steps */}
                <div className="progress-steps">
                {visibleSteps.map((step, idx) => {
                    const isActive = currentStepKey === step.key;
                    const isCompleted = idx < currentIndex;

                    return (
                    <div
                        key={step.key}
                        className={`progress-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                        onClick={() => setCurrentStepKey(step.key)}
                    >
                        <div className="step-icon">{step.icon}</div>
                        <div className="step-info">
                        <div className="step-number">Step {idx + 1}</div>
                        <div className="step-title">{step.title}</div>
                        </div>
                    </div>
                    );
                })}
                </div>

                <div className="modal-content">
                    {/* Step 1: Basic Info */}
                    {currentStepKey === 'basic' && (
                        <div className="form-section">
                            <h3>Basic Information</h3>
                            
                            <div className="form-group">
                                <label>Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="Enter artifact title"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Type *</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="" disabled>Select a type...</option>
                                    <option value="Photo">Photo</option>
                                    <option value="Interview">Interview</option>
                                    <option value="Document">Document</option>
                                    <option value="Object">Object</option>
                                    <option value="Student Work">Student Work</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Upload Image *</label>
                                <div className="file-upload-area">
                                    {formData.imagePreview ? (
                                        <div className="image-preview">
                                            <img src={formData.imagePreview} alt="Preview" />
                                            <button 
                                                type="button"
                                                className="remove-image-btn"
                                                onClick={() => setFormData(prev => ({ ...prev, image: null, imagePreview: '' }))}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="file-upload-label">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileUpload}
                                                hidden
                                            />
                                            <div className="upload-placeholder">
                                                <span className="upload-icon">📁</span>
                                                <span>Click to upload image</span>
                                                <span className="upload-hint">PNG, JPG up to 10MB</span>
                                            </div>
                                        </label>
                                    )}
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Tags</label>
                                <div className="tag-input-container">
                                    <input
                                        type="text"
                                        value={formData.tagInput}
                                        onChange={(e) => setFormData(prev => ({ ...prev, tagInput: e.target.value }))}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                                        placeholder="Add a tag and press Enter"
                                    />
                                    <button type="button" onClick={handleAddTag} className="add-tag-btn">
                                        Add Tag
                                    </button>
                                </div>
                                <div className="tags-display">
                                    {formData.tags.map((tag, index) => (
                                        <span key={index} className="tag-item">
                                            {tag}
                                            <button 
                                                type="button"
                                                onClick={() => handleRemoveTag(index)}
                                                className="remove-tag-btn"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Uploaded By</label>
                                <input
                                    type="text"
                                    name="uploader"
                                    value={formData.uploader}
                                    onChange={handleInputChange}
                                    placeholder="Your name"
                                />
                            </div>

                            <div className="form-group">
                                <label>Collection (Optional)</label>
                                <select
                                    value={formData.collectionId || ''}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        collectionId: e.target.value || null
                                    }))}
                                >
                                    <option value="">No collection — general archive</option>
                                    {collections.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                <span className="field-hint">Assign this artifact to a folder, or leave blank to add it to the general archive.</span>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Context */}
                    {currentStepKey === 'context' && (
                        <div className="form-section">
                            <h3>Context & Description</h3>
                            
                            <div className="form-group">
                                <label>Context *</label>
                                <textarea
                                    name="context"
                                    value={formData.context}
                                    onChange={handleInputChange}
                                    placeholder="Describe the circumstances of documentation, fieldwork context, or background information"
                                    rows="4"
                                    required
                                />
                                <span className="field-hint">Where and how was this artifact documented?</span>
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="General description of the artifact"
                                    rows="4"
                                />
                            </div>
                            
                            {rules.showTranscript && (
                            <div className="form-group">
                                <label>Interview Transcript / Field Notes</label>
                                <textarea
                                name="transcript"
                                value={formData.transcript}
                                onChange={handleInputChange}
                                placeholder="Paste interview transcript or field notes here"
                                rows="8"
                                />
                                <span className="field-hint">Format: Interviewer: ... / Subject: ...</span>
                            </div>
                            )}

                        </div>
                    )}

                    {/* Step 3: Location */}
                    {currentStepKey === 'location' && rules.showLocation && (
                        <div className="form-section">
                            <h3>Location (Where)</h3>
                            
                            <div className="form-group">
                                <label>Specific Place</label>
                                <input
                                    type="text"
                                    value={formData.location.place}
                                    onChange={(e) => handleNestedChange('location', 'place', e.target.value)}
                                    placeholder="e.g., Burlington Farmers Market"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>City</label>
                                    <input
                                        type="text"
                                        value={formData.location.city}
                                        onChange={(e) => handleNestedChange('location', 'city', e.target.value)}
                                        placeholder="City"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>State/Province</label>
                                    <input
                                        type="text"
                                        value={formData.location.state}
                                        onChange={(e) => handleNestedChange('location', 'state', e.target.value)}
                                        placeholder="State or Province"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Country</label>
                                <input
                                    type="text"
                                    value={formData.location.country}
                                    onChange={(e) => handleNestedChange('location', 'country', e.target.value)}
                                    placeholder="Country"
                                />
                            </div>

                            <div className="form-group">
                                <label>GPS Coordinates (Optional)</label>
                                <input
                                    type="text"
                                    value={formData.location.coordinates}
                                    onChange={(e) => handleNestedChange('location', 'coordinates', e.target.value)}
                                    placeholder="e.g., 44.4759° N, 73.2121° W"
                                />
                                <span className="field-hint">Format: XX.XXXX° N/S, XX.XXXX° E/W</span>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Time & Subject */}
                    {currentStepKey === 'timeSubject' && (
                        <div className="form-section">
                            <h3>Time Period (When)</h3>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Created/Made</label>
                                    <input
                                        type="text"
                                        value={formData.timePeriod.created}
                                        onChange={(e) => handleNestedChange('timePeriod', 'created', e.target.value)}
                                        placeholder="e.g., Spring 2023"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Documented</label>
                                    <input
                                        type="date"
                                        value={formData.timePeriod.documented}
                                        onChange={(e) => handleNestedChange('timePeriod', 'documented', e.target.value)}
                                    />
                                </div>
                            </div>

                            {rules.showHistoricalEra && (
                            <div className="form-group">
                                <label>Historical Era/Period</label>
                                <input
                                type="text"
                                value={formData.timePeriod.era}
                                onChange={(e) => handleNestedChange('timePeriod', 'era', e.target.value)}
                                placeholder="e.g., Contemporary, Medieval, 19th Century"
                                />
                            </div>
                            )}

                            
                            {rules.showSubject && (
                                <>
                                    <hr className="section-divider" />

                                    <h3>Subject (Who)</h3>

                                    <div className="form-group">
                                        <label>Subject Name</label>
                                        <input
                                            type="text"
                                            value={formData.subject.name}
                                            onChange={(e) => handleNestedChange('subject', 'name', e.target.value)}
                                            placeholder="Name of person, group, or entity"
                                        />
                                    </div>

                                    <div className="form-group checkbox-group">
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={formData.subject.isPseudonym}
                                                onChange={(e) => handleNestedChange('subject', 'isPseudonym', e.target.checked)}
                                            />
                                            <span>This is a pseudonym (protect identity)</span>
                                        </label>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Role/Occupation</label>
                                            <input
                                                type="text"
                                                value={formData.subject.role}
                                                onChange={(e) => handleNestedChange('subject', 'role', e.target.value)}
                                                placeholder="e.g., Artisan, Elder, Teacher"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Community/Group</label>
                                            <input
                                                type="text"
                                                value={formData.subject.community}
                                                onChange={(e) => handleNestedChange('subject', 'community', e.target.value)}
                                                placeholder="e.g., Abenaki, Local residents"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                        </div>
                    )}

                    {/* Step 5: Physical Details */}
                    {currentStepKey === 'physical' && rules.showPhysical &&  (
                        <div className="form-section">
                            <h3>Physical Description</h3>
                            
                            <div className="form-group">
                                <label>Materials</label>
                                <input
                                    type="text"
                                    value={formData.physicalDescription.materials}
                                    onChange={(e) => handleNestedChange('physicalDescription', 'materials', e.target.value)}
                                    placeholder="e.g., Sweetgrass, ash wood, natural dyes"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Physical Dimensions</label>
                                    <input
                                        type="text"
                                        value={formData.physicalDescription.dimensions}
                                        onChange={(e) => handleNestedChange('physicalDescription', 'dimensions', e.target.value)}
                                        placeholder="e.g., 12 inches diameter"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Weight</label>
                                    <input
                                        type="text"
                                        value={formData.physicalDescription.weight}
                                        onChange={(e) => handleNestedChange('physicalDescription', 'weight', e.target.value)}
                                        placeholder="e.g., 1.5 lbs"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Condition</label>
                                <input
                                    type="text"
                                    value={formData.physicalDescription.condition}
                                    onChange={(e) => handleNestedChange('physicalDescription', 'condition', e.target.value)}
                                    placeholder="e.g., Excellent - actively used"
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 6: Meaning */}
                    {currentStepKey === 'meaning' && (
                        <div className="form-section">
                            <h3>Function & Cultural Meaning</h3>
                            
                            <div className="form-group">
                                <label>Function</label>
                                <textarea
                                    name="function"
                                    value={formData.function}
                                    onChange={handleInputChange}
                                    placeholder="What is/was this artifact used for? How does it function?"
                                    rows="4"
                                />
                            </div>

                            <div className="form-group">
                                <label>Cultural Meaning/Significance</label>
                                <textarea
                                    name="meaning"
                                    value={formData.meaning}
                                    onChange={handleInputChange}
                                    placeholder="What does this artifact mean culturally, spiritually, or symbolically?"
                                    rows="4"
                                />
                            </div>

                            <hr className="section-divider" />

                            <h3>Student Analysis (Optional)</h3>
                            
                            <div className="form-group checkbox-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={formData.analysis.hasStudentWork}
                                        onChange={(e) => handleNestedChange('analysis', 'hasStudentWork', e.target.checked)}
                                    />
                                    <span>This artifact has associated student work</span>
                                </label>
                            </div>

                            {formData.analysis.hasStudentWork && (
                                <>
                                    <div className="form-group">
                                        <label>Course</label>
                                        <input
                                            type="text"
                                            value={formData.analysis.course}
                                            onChange={(e) => handleNestedChange('analysis', 'course', e.target.value)}
                                            placeholder="e.g., ANTH 301 - Cultural Anthropology"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Student Name</label>
                                        <input
                                            type="text"
                                            value={formData.analysis.student}
                                            onChange={(e) => handleNestedChange('analysis', 'student', e.target.value)}
                                            placeholder="Student name"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Analysis Summary</label>
                                        <textarea
                                            value={formData.analysis.summary}
                                            onChange={(e) => handleNestedChange('analysis', 'summary', e.target.value)}
                                            placeholder="Brief summary of student analysis"
                                            rows="3"
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Step 7: Privacy & Consent */}
                    {currentStepKey === 'privacy' && (
                        <div className="form-section">
                            <h3>Privacy Settings</h3>
                            
                            <div className="form-group">
                                <label>Privacy Level *</label>
                                <select
                                    value={formData.privacy.level}
                                    onChange={(e) => handleNestedChange('privacy', 'level', e.target.value)}
                                >
                                    <option value="Public Domain">Public Domain</option>
                                    <option value="Restricted - Identity Protected">Restricted - Identity Protected</option>
                                    <option value="Classroom Use Only">Classroom Use Only</option>
                                    <option value="Research Only">Research Only</option>
                                </select>
                            </div>

                            <div className="form-group checkbox-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={formData.privacy.identityProtected}
                                        onChange={(e) => handleNestedChange('privacy', 'identityProtected', e.target.checked)}
                                    />
                                    <span>Identity is protected (pseudonym used)</span>
                                </label>
                            </div>

                            <div className="form-group">
                                <label>Privacy Notes</label>
                                <textarea
                                    value={formData.privacy.notes}
                                    onChange={(e) => handleNestedChange('privacy', 'notes', e.target.value)}
                                    placeholder="Any specific privacy considerations or restrictions"
                                    rows="2"
                                />
                            </div>

                            <hr className="section-divider" />

                            <h3>Consent & IRB</h3>
                            
                            <div className="form-group checkbox-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={formData.consent.formSigned}
                                        onChange={(e) => handleNestedChange('consent', 'formSigned', e.target.checked)}
                                    />
                                    <span>Consent form signed</span>
                                </label>
                            </div>

                            {formData.consent.formSigned && (
                                <div className="form-group">
                                    <label>Date Signed</label>
                                    <input
                                        type="date"
                                        value={formData.consent.dateSigned}
                                        onChange={(e) => handleNestedChange('consent', 'dateSigned', e.target.value)}
                                    />
                                </div>
                            )}

                            <div className="permissions-section">
                                <label>Usage Permissions</label>
                                <div className="checkbox-group">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={formData.consent.permissions.archiveUse}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                consent: {
                                                    ...prev.consent,
                                                    permissions: {
                                                        ...prev.consent.permissions,
                                                        archiveUse: e.target.checked
                                                    }
                                                }
                                            }))}
                                        />
                                        <span>Archive Use</span>
                                    </label>

                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={formData.consent.permissions.classroomUse}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                consent: {
                                                    ...prev.consent,
                                                    permissions: {
                                                        ...prev.consent.permissions,
                                                        classroomUse: e.target.checked
                                                    }
                                                }
                                            }))}
                                        />
                                        <span>Classroom Use</span>
                                    </label>

                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={formData.consent.permissions.publicDisplay}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                consent: {
                                                    ...prev.consent,
                                                    permissions: {
                                                        ...prev.consent.permissions,
                                                        publicDisplay: e.target.checked
                                                    }
                                                }
                                            }))}
                                        />
                                        <span>Public Display</span>
                                    </label>

                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={formData.consent.permissions.commercialUse}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                consent: {
                                                    ...prev.consent,
                                                    permissions: {
                                                        ...prev.consent.permissions,
                                                        commercialUse: e.target.checked
                                                    }
                                                }
                                            }))}
                                        />
                                        <span>Commercial Use</span>
                                    </label>
                                </div>
                            </div>

                            <div className="form-group checkbox-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={formData.consent.irbApproved}
                                        onChange={(e) => handleNestedChange('consent', 'irbApproved', e.target.checked)}
                                    />
                                    <span>IRB Approved</span>
                                </label>
                            </div>

                            {formData.consent.irbApproved && (
                                <>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>IRB Number</label>
                                            <input
                                                type="text"
                                                value={formData.consent.irbNumber}
                                                onChange={(e) => handleNestedChange('consent', 'irbNumber', e.target.value)}
                                                placeholder="e.g., IRB-2024-001"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>IRB Approval Date</label>
                                            <input
                                                type="date"
                                                value={formData.consent.irbDate}
                                                onChange={(e) => handleNestedChange('consent', 'irbDate', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Navigation Buttons */}
                <div className="modal-footer">
                    <button 
                        type="button"
                        className="btn-secondary"
                        onClick={handleClose}
                    >
                        Cancel
                    </button>
                    
                    <div className="footer-right">
                        {currentIndex > 0 && (
                            <button
                            type="button"
                            className="btn-secondary"
                            onClick={handlePrevious}
                            >
                            ← Previous
                            </button>
                        )}

                        {currentIndex < visibleSteps.length - 1 ? (
                            <button
                            type="button"
                            className="btn-primary"
                            onClick={handleNext}
                            >
                            Next →
                            </button>
                        ) : (
                            <button
                            type="button"
                            className="btn-primary"
                            onClick={handleSubmit}
                            disabled={!formData.title || !formData.type || !formData.imagePreview}
                            >
                            Save Artifact
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddArtifactModal;
