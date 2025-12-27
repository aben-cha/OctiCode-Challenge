# Mini REST API Challenge : “Notes & Summaries”

## Goal
    Build a small REST API to manage patients, their voice-note metadata (no file
    upload), and AI-like summaries (no AI just example plain text). Focus on clean
    structure, validation, and clarity.


**Patients**:

    POST /api/patients - Create patient
    GET /api/patients - List all patients
    GET /api/patients/:id - Get specific patient
    PUT /api/patients/:id - Update patient
    DELETE /api/patients/:id - Delete patient


**Notes**:

    POST /api/patients/:patientId/notes - Create note for patient
    GET /api/patients/:patientId/notes - Get all notes for patient
    GET /api/notes/:id - Get specific note
    DELETE /api/notes/:id - Delete note

**Summaries**:

    POST /api/notes/:noteId/summaries - Generate/create summary
    GET /api/notes/:noteId/summaries - Get summary for note

**Bonus**:

    GET /health - Health check endpoint