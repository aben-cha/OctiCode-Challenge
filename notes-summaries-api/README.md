# Mini REST API Challenge : “Notes & Summaries”

## Goal
    Build a small REST API to manage patients, their voice-note metadata (no file
    upload), and AI-like summaries (no AI just example plain text). Focus on clean
    structure, validation, and clarity.

## 🚀 Tech Stack
    Node.js + TypeScript
    Express
    Validation: Zod
    Persistence: SQLite
    Testing: Vitest

## 🏗️ Project Structure: 

    notes-summaries-api/
    ├── src/
    │   ├── index.ts                 # Entry point, starts Express server
    │   ├── routes/                  # API routes (HTTP endpoints)
    │   │   ├── patients.ts          # /patients endpoints
    │   │   ├── notes.ts             # /notes endpoints
    │   │   └── summaries.ts         # /summaries endpoints
    │   ├── schemas/                 # Validation layer
    │   │   └── validation.ts        # Zod schemas for request validation
    │   ├── services/                # Business logic
    │   │   └── database.ts          # SQLite or JSON file persistence handling
    │   ├── middlewares/             # Middleware layer
    │   │   ├── auth.ts              # API key validation
    │   │   ├── errorHandler.ts      # Error handling
    │   │   └── rateLimiter.ts       # Rate limiting per API key (bonus)
    │   └── utils/                   # Utility functions
    │       └── logger.ts            # Logger with request IDs (bonus)
    ├── data/                        # Persistence layer
    │   └── db.json or database.sqlite
    ├── tests/                       # Test layer
    │   └── api.test.ts              # Minimal meaningful tests
    ├── .env                         # Environment variables (API keys, DB path)
    ├── package.json                 # Dependencies & scripts
    ├── tsconfig.json                # TypeScript config
    ├── .prettierrc                  # Code formatting (bonus)
    └── .eslintrc.js                 # Linting (bonus)


## Key Endpoints
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