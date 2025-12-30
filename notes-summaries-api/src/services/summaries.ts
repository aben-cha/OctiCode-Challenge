import { db } from './database';
import { CreateSummaryInput, UpdateSummaryInput } from '../schemas/validation';
import { Summary, SummaryDTO } from '../types/entities';

// Convert DB row to DTO
const toDTO = (summary: Summary): SummaryDTO => ({
  id: summary.id,
  noteId: summary.note_id,
  content: summary.content,
  generatedAt: summary.generated_at,
  version: summary.version,
});

export const create = (noteId: number, data: CreateSummaryInput): SummaryDTO => {
  // Get the latest version for this note
  const latestVersion = db
    .prepare('SELECT MAX(version) as max_version FROM summaries WHERE note_id = ?')
    .get(noteId) as { max_version: number | null };

  const newVersion = (latestVersion.max_version || 0) + 1;

  const insert = db
    .prepare(
      `INSERT INTO summaries (note_id, content, version) 
       VALUES (?, ?, ?)`
    )
    .run(noteId, data.content, newVersion);

  const id = insert.lastInsertRowid as number;

  const summary = db.prepare('SELECT * FROM summaries WHERE id = ?').get(id) as Summary;

  return toDTO(summary);
};

export const findByNote = (noteId: number): SummaryDTO[] => {
  const summaries = db
    .prepare('SELECT * FROM summaries WHERE note_id = ? ORDER BY version DESC')
    .all(noteId) as Summary[];

  return summaries.map(toDTO);
};

export const findLatestByNote = (noteId: number): SummaryDTO | null => {
  const summary = db
    .prepare('SELECT * FROM summaries WHERE note_id = ? ORDER BY version DESC LIMIT 1')
    .get(noteId) as Summary | undefined;

  return summary ? toDTO(summary) : null;
};

export const findById = (id: number): SummaryDTO | null => {
  const summary = db.prepare('SELECT * FROM summaries WHERE id = ?').get(id) as Summary | undefined;

  return summary ? toDTO(summary) : null;
};

export const update = (id: number, data: UpdateSummaryInput): SummaryDTO | null => {
  if (!data.content) {
    return findById(id);
  }

  const result = db.prepare('UPDATE summaries SET content = ? WHERE id = ?').run(data.content, id);

  if (result.changes === 0) {
    return null;
  }

  return findById(id);
};

export const remove = (id: number): boolean => {
  const result = db.prepare('DELETE FROM summaries WHERE id = ?').run(id);

  return result.changes > 0;
};
