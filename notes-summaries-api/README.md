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
    │   ├── server.ts                  # Application entry point (starts HTTP server)
    │   ├── app.ts                     # Express app configuration (middlewares & routes)
    │   ├── config/
    │   │   └── config.ts              # Environment & app configuration
    │   ├── controllers/               # Request/response handlers
    │   │   ├── patients.ts            # Patients controller
    │   │   ├── notes.ts               # Notes controller
    │   │   └── summaries.ts           # Summaries controller
    │   ├── routes/                    # API route definitions
    │   │   ├── patients.ts            # /patients endpoints
    │   │   ├── notes.ts               # /notes endpoints
    │   │   └── summaries.ts           # /summaries endpoints
    │   ├── schemas/                   # Validation layer
    │   │   └── validation.ts          # Zod schemas for request validation
    │   ├── services/                  # Business logic & data access
    │   │   ├── database.ts            # SQLite initialization & connection
    │   │   ├── patients.ts            # Patients service
    │   │   ├── notes.ts               # Notes service
    │   │   └── summaries.ts           # Summaries service
    │   ├── middlewares/               # Cross-cutting concerns
    │   │   ├── auth.ts                # API key authentication
    │   │   ├── rateLimiter.ts         # Rate limiting per API key
    │   │   └── errorHandler.ts        # Centralized error handling
    │   └── utils/                     # Shared utilities
    │       └── logger.ts              # Logger with request IDs
    ├── data/
    │   └── database.sqlite            # SQLite database file
    ├── tests/
    │   └── api.test.ts                # API integration tests
    ├── .env                           # Environment variables
    ├── package.json                   # Dependencies & scripts
    ├── tsconfig.json                  # TypeScript configuration
    ├── .prettierrc                    # Code formatting rules (bonus)
    └── .eslintrc.js                   # Linting rules (bonus)

## Architecture Flow (Simple Explanation)

    Client → Routes → Controllers → Services → SQLite
                    ↓
            Zod Validation
                    ↓
            Middlewares (auth, rate-limit, logger)

## Key Endpoints
**Patients**:

    POST /api/patients - Create patient
    GET /api/patients - List all patients
    GET /api/patients/:id - Get specific patient
    PUT /api/patients/:id - Update patient
    DELETE /api/patients/:id - Delete patient


**Notes**:

    POST   /api/patients/:patientId/notes     - Create a note for a patient
    GET    /api/patients/:patientId/notes     - Get all notes for a patient
    GET    /api/notes/:id                     - Get a specific note by ID
    PUT    /api/notes/:id                     - Update a note
    DELETE /api/notes/:id                     - Delete a note

**Summaries**:

    POST   /api/notes/:noteId/summaries       - Create/generate a summary for a note
    GET    /api/notes/:noteId/summaries       - Get all summaries for a note
    GET    /api/summaries/:id                 - Get a specific summary by ID
    PUT    /api/summaries/:id                 - Update a summary
    DELETE /api/summaries/:id                 - Delete a summary

**Bonus**:

    GET /health - Health check endpoint