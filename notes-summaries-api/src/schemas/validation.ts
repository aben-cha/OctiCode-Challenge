import { z } from 'zod';

// ============================================================================
// Patient Schemas
// ============================================================================

export const createPatientSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  medicalRecordNumber: z.string().min(1, 'Medical record number is required').max(50),
});

export const updatePatientSchema = createPatientSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

export const patientIdSchema = z.object({
  id: z.coerce.number().int().positive('Invalid patient ID'),
});

// ============================================================================
// Note Schemas
// ============================================================================

export const createNoteSchema = z.object({
  patientId: z.coerce.number().int().positive('Patient ID must be a positive integer'),
  doctorId: z.coerce.number().int().positive('Doctor ID must be a positive integer'),
  recordedAt: z.string().datetime('Invalid datetime format'),
  duration: z.coerce.number().int().nonnegative('Duration must be non-negative'),
  transcription: z.string().max(10000).optional(),
  fileSize: z.coerce.number().int().positive().optional(),
  fileFormat: z.string().max(50).optional(),
});

export const updateNoteSchema = z
  .object({
    transcription: z.string().max(10000).optional(),
    duration: z.coerce.number().int().nonnegative().optional(),
    fileSize: z.coerce.number().int().positive().optional(),
    fileFormat: z.string().max(50).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

export const noteIdSchema = z.object({
  id: z.coerce.number().int().positive('Invalid note ID'),
});

export const patientNotesQuerySchema = z.object({
  patientId: z.coerce.number().int().positive('Invalid patient ID'),
});

// ============================================================================
// Summary Schemas
// ============================================================================

export const createSummarySchema = z.object({
  noteId: z.coerce.number().int().positive('Note ID must be a positive integer'),
  content: z.string().min(1, 'Content is required').max(50000),
});

export const updateSummarySchema = z
  .object({
    content: z.string().min(1).max(50000).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

export const summaryIdSchema = z.object({
  id: z.coerce.number().int().positive('Invalid summary ID'),
});

export const noteSummariesQuerySchema = z.object({
  noteId: z.coerce.number().int().positive('Invalid note ID'),
});

// ============================================================================
// Type Inference
// ============================================================================

export type CreatePatientInput = z.infer<typeof createPatientSchema>;
export type UpdatePatientInput = z.infer<typeof updatePatientSchema>;
export type PatientIdParams = z.infer<typeof patientIdSchema>;

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
export type NoteIdParams = z.infer<typeof noteIdSchema>;

export type CreateSummaryInput = z.infer<typeof createSummarySchema>;
export type UpdateSummaryInput = z.infer<typeof updateSummarySchema>;
export type SummaryIdParams = z.infer<typeof summaryIdSchema>;
