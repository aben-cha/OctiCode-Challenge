import z from 'zod';

// ================================================
// Patient Schemas
// ================================================

export const createPatientSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  medicalRecordNumber: z.string().min(1, 'Medical record number is required').max(50),
});

export const updatePatient = z
  .object({
    firstName: z.string().min(1).max(100).optional(),
    lastName: z.string().min(1).max(100).optional(),
    dateOfBirth: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
    medicalRecordNumber: z.string().min(1, 'Medical record number is required').max(50),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

export const patientID = z.object({
  id: z.string().regex(/^\d+$/, 'Invalid patient ID').transform(Number),
});
