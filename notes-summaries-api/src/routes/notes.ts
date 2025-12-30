import { Router } from 'express';
import { validateParams, validateBody } from '../middlewares/validate';
import {
  createNoteSchema,
  updateNoteSchema,
  noteIdSchema,
  patientNotesQuerySchema,
} from '../schemas/validation';
import * as noteController from '../controllers/notes';

const router = Router();

/**
 * @swagger
 * /api/patients/{patientId}/notes:
 *   post:
 *     summary: Create a note for a patient
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Patient ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateNote'
 *     responses:
 *       201:
 *         description: Note created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Note'
 *       404:
 *         description: Patient not found
 */
router.post(
  '/patients/:patientId/notes',
  validateParams(patientNotesQuerySchema),
  validateBody(createNoteSchema),
  noteController.createNote
);

/**
 * @swagger
 * /api/patients/{patientId}/notes:
 *   get:
 *     summary: Get all notes for a patient
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Patient ID
 *     responses:
 *       200:
 *         description: List of notes for the patient
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Note'
 *       404:
 *         description: Patient not found
 */
router.get(
  '/patients/:patientId/notes',
  validateParams(patientNotesQuerySchema),
  noteController.getNotesByPatient
);

/**
 * @swagger
 * /api/notes/{id}:
 *   get:
 *     summary: Get a note by ID
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Note ID
 *     responses:
 *       200:
 *         description: Note details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Note'
 *       404:
 *         description: Note not found
 */
router.get('/notes/:id', validateParams(noteIdSchema), noteController.getNoteById);

/**
 * @swagger
 * /api/notes/{id}:
 *   put:
 *     summary: Update a note
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Note ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateNote'
 *     responses:
 *       200:
 *         description: Note updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Note'
 *       404:
 *         description: Note not found
 */
router.put(
  '/notes/:id',
  validateParams(noteIdSchema),
  validateBody(updateNoteSchema),
  noteController.updateNote
);

/**
 * @swagger
 * /api/notes/{id}:
 *   delete:
 *     summary: Delete a note
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Note ID
 *     responses:
 *       200:
 *         description: Note deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Note not found
 */
router.delete('/notes/:id', validateParams(noteIdSchema), noteController.deleteNote);

export default router;
