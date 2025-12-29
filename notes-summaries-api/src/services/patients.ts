import { CreatePatientInput } from '@/schemas/validation';
import { db } from './database';
import { Patient, PatientDTO } from '@/types/entities';

const toDTO = (patient: Patient): PatientDTO => ({
  id: patient.id,
  firstName: patient.first_name,
  lastName: patient.last_name,
  dateOfBirth: patient.date_of_birth,
  medicalRecordNumber: patient.medical_record_number,
  createdAt: patient.created_at,
  updatedAt: patient.updated_at,
});

export const findAll = (): PatientDTO[] => {
  const patients = db.prepare(`SELECT * FROM patients`).all() as Patient[];
  return patients.map(toDTO);
};

export const findById = (id: number): PatientDTO | null => {
  const patient = db.prepare(`SELECT * FROM patients WHERE id = ?`).get(id) as Patient | undefined;
  return patient ? toDTO(patient) : null;
};

export const create = (data: CreatePatientInput): PatientDTO => {
  const insert = db
    .prepare(
      `INSERT INTO patients (first_name, last_name, date_of_birth, medical_record_number) 
       VALUES (?, ?, ?, ?)`
    )
    .run(data.firstName, data.lastName, data.dateOfBirth, data.medicalRecordNumber);
  const id = insert.lastInsertRowid as number;

  const patient = db.prepare('SELECT * FROM patients WHERE id = ?').get(id) as Patient;
  return toDTO(patient);
};

// export const update = (id: string, data: UpdatePatientInput) => {
//   //
// };

export const remove = (id: number): boolean => {
  const patient = db.prepare('SELECT id FROM patients WHERE id = ?').get(id) as PatientDTO | null;

  if (!patient) return false;

  const result = db.prepare('DELETE FROM patients WHERE id = ?').run(patient.id);

  return result.changes > 0;
};
