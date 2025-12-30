import { CreateNoteInput, UpdateNoteInput } from '../schemas/validation';
import { db } from './database';
import { Note, NoteDTO } from '../types/entities';

const toDTO = (note: Note): NoteDTO => ({
  id: note.id,
  patientId: note.patient_id,
  doctorId: note.doctor_id,
  recordedAt: note.recorded_at,
  duration: note.duration,
  transcription: note.transcription || undefined,
  metadata: {
    fileSize: note.file_size || undefined,
    fileFormat: note.file_format || undefined,
  },
  createdAt: note.created_at,
});

export const findById = (id: number): NoteDTO | null => {
  const note = db.prepare(`SELECT * FROM note WHERE id = ?`).get(id) as Note | undefined;
  return note ? toDTO(note) : null;
};

export const create = (patientId: number, data: CreateNoteInput): NoteDTO => {
  const insert = db
    .prepare(
      `INSERT INTO notes (patient_id, doctor_id, recorded_at, duration, transcription, file_size, file_format) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      patientId,
      data.doctorId,
      data.recordedAt,
      data.duration,
      data.transcription || null,
      data.fileSize || null,
      data.fileFormat || null
    );
  const id = insert.lastInsertRowid as number;

  const note = db.prepare('SELECT * FROM notes WHERE id = ?').get(id) as Note;
  return toDTO(note);
};

export const findByPatient = (patientId: number): NoteDTO[] => {
  const notes = db
    .prepare(`SELECT * FROM notes WHERE patient_id = ? ORDER BY recorded_at DESC`)
    .all(patientId) as Note[];
  return notes.map(toDTO);
};

export const remove = (id: number): boolean => {
  const note = db.prepare('SELECT id FROM notes WHERE id = ?').get(id) as NoteDTO | null;

  if (!note) return false;

  const result = db.prepare('DELETE FROM notes WHERE id = ?').run(note.id);

  return result.changes > 0;
};

export const update = (id: number, data: UpdateNoteInput): NoteDTO | null => {
  const fields: string[] = [];
  const values: any[] = [];

  if (data.transcription !== undefined) {
    fields.push('transcription = ?');
    values.push(data.transcription);
  }
  if (data.duration !== undefined) {
    fields.push('duration = ?');
    values.push(data.duration);
  }
  if (data.fileSize !== undefined) {
    fields.push('file_size = ?');
    values.push(data.fileSize);
  }
  if (data.fileFormat !== undefined) {
    fields.push('file_format = ?');
    values.push(data.fileFormat);
  }

  if (fields.length === 0) {
    return findById(id);
  }

  values.push(id);

  const result = db.prepare(`UPDATE notes SET ${fields.join(', ')} WHERE id = ?`).run(...values);

  if (result.changes === 0) {
    return null;
  }

  return findById(id);
};
