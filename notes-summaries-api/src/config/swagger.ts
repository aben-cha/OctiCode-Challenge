import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Notes & Summaries API',
      version: '1.0.0',
      description: 'REST API for managing patients, voice notes metadata, and AI-like summaries',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-api-key',
          description: 'API key for authentication',
        },
      },
      schemas: {
        Patient: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            firstName: { type: 'string', example: 'John' },
            lastName: { type: 'string', example: 'Doe' },
            dateOfBirth: { type: 'string', format: 'date', example: '1990-01-01' },
            medicalRecordNumber: { type: 'string', example: 'MRN12345' },
            createdAt: { type: 'string', format: 'date-time', example: '2025-12-30T10:00:00Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2025-12-30T10:00:00Z' },
          },
        },
        CreatePatient: {
          type: 'object',
          required: ['firstName', 'lastName', 'dateOfBirth', 'medicalRecordNumber'],
          properties: {
            firstName: { type: 'string', example: 'John' },
            lastName: { type: 'string', example: 'Doe' },
            dateOfBirth: { type: 'string', format: 'date', example: '1990-01-01' },
            medicalRecordNumber: { type: 'string', example: 'MRN12345' },
          },
        },
        UpdatePatient: {
          type: 'object',
          properties: {
            firstName: { type: 'string', example: 'John' },
            lastName: { type: 'string', example: 'Doe' },
            dateOfBirth: { type: 'string', format: 'date', example: '1990-01-01' },
            medicalRecordNumber: { type: 'string', example: 'MRN12345' },
          },
        },
        Note: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            patientId: { type: 'integer', example: 1 },
            doctorId: { type: 'integer', example: 1 },
            recordedAt: { type: 'string', format: 'date-time', example: '2025-12-30T10:00:00Z' },
            duration: { type: 'integer', example: 300, description: 'Duration in seconds' },
            transcription: { type: 'string', example: 'Patient reports mild headache...' },
            metadata: {
              type: 'object',
              properties: {
                fileSize: { type: 'integer', example: 1024000 },
                fileFormat: { type: 'string', example: 'mp3' },
              },
            },
            createdAt: { type: 'string', format: 'date-time', example: '2025-12-30T10:00:00Z' },
          },
        },
        CreateNote: {
          type: 'object',
          required: ['doctorId', 'recordedAt', 'duration'],
          properties: {
            doctorId: { type: 'integer', example: 1 },
            recordedAt: { type: 'string', format: 'date-time', example: '2025-12-30T10:00:00Z' },
            duration: { type: 'integer', example: 300, description: 'Duration in seconds' },
            transcription: { type: 'string', example: 'Patient reports mild headache...' },
            fileSize: { type: 'integer', example: 1024000 },
            fileFormat: { type: 'string', example: 'mp3' },
          },
        },
        UpdateNote: {
          type: 'object',
          properties: {
            transcription: { type: 'string', example: 'Updated transcription...' },
            duration: { type: 'integer', example: 350 },
            fileSize: { type: 'integer', example: 1024000 },
            fileFormat: { type: 'string', example: 'mp3' },
          },
        },
        Summary: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            noteId: { type: 'integer', example: 1 },
            content: { type: 'string', example: 'Patient presents with mild headache...' },
            generatedAt: { type: 'string', format: 'date-time', example: '2025-12-30T10:00:00Z' },
            version: { type: 'integer', example: 1 },
          },
        },
        CreateSummary: {
          type: 'object',
          required: ['content'],
          properties: {
            content: { type: 'string', example: 'Patient presents with mild headache...' },
          },
        },
        UpdateSummary: {
          type: 'object',
          properties: {
            content: { type: 'string', example: 'Updated summary content...' },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { type: 'object' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string', example: 'Error message' },
          },
        },
      },
    },
    // security: [{ ApiKeyAuth: [] }],
  },
  apis: ['./src/routes/*.ts'], // Path to route files
};

export const swaggerSpec = swaggerJsdoc(options);
