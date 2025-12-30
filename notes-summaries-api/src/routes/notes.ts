import { Router } from 'express';
import { validateParams, validateBody } from '@/middlewares/validate';
import * as noteController from '@/controllers/notes';
import {
  createNoteSchema,
  noteIdSchema,
  patientNotesQuerySchema,
  updateNoteSchema,
} from '@/schemas/validation';

const router = Router();

// Create note for a patient
router.post(
  '/patients/:patientId/notes',
  validateParams(patientNotesQuerySchema),
  validateBody(createNoteSchema),
  noteController.createNote
);

// Get all notes for a patient
router.get(
  '/patients/:patientId/notes',
  validateParams(patientNotesQuerySchema),
  noteController.getNotesByPatient
);

// Get note by ID
router.get('/notes/:id', validateParams(noteIdSchema), noteController.getNoteById);

// Update note
router.put(
  '/notes/:id',
  validateParams(noteIdSchema),
  validateBody(updateNoteSchema),
  noteController.updateNote
);

// Delete note
router.delete('/notes/:id', validateParams(noteIdSchema), noteController.deleteNote);

export default router;
