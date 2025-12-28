export interface Patient {
  id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  medical_record_number: string;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: number;
  patient_id: number;
  doctor_id: number;
  recorded_at: string;
  duration: number;
  transcription: string | null;
  file_size: number | null;
  file_format: string | null;
  created_at: string;
}

export interface Summary {
  id: number;
  note_id: number;
  content: string;
  generated_at: string;
  version: number;
}

// API-friendly versions (camelCase for JavaScript)
export interface PatientDTO {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  medicalRecordNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface NoteDTO {
  id: number;
  patientId: number;
  doctorId: number;
  recordedAt: string;
  duration: number;
  transcription?: string;
  metadata?: {
    fileSize?: number;
    fileFormat?: string;
  };
  createdAt: string;
}

export interface SummaryDTO {
  id: number;
  noteId: number;
  content: string;
  generatedAt: string;
  version: number;
}

// Input types (for creating new records - without id and timestamps)
export interface CreatePatientInput {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  medicalRecordNumber: string;
}

export interface CreateNoteInput {
  patientId: number;
  doctorId: number;
  recordedAt: string;
  duration: number;
  transcription?: string;
  fileSize?: number;
  fileFormat?: string;
}

export interface CreateSummaryInput {
  noteId: number;
  content: string;
}
