import { Router } from 'express';
import { validateParams, validateBody } from '../middlewares/validate';
import {
  createSummarySchema,
  updateSummarySchema,
  summaryIdSchema,
  noteSummariesQuerySchema,
} from '../schemas/validation';
import * as summaryController from '../controllers/summaries';

const router = Router();

/**
 * @swagger
 * /api/notes/{noteId}/summaries:
 *   post:
 *     summary: Create a summary for a note
 *     tags: [Summaries]
 *     parameters:
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Note ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSummary'
 *     responses:
 *       201:
 *         description: Summary created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Summary'
 *       404:
 *         description: Note not found
 */
router.post(
  '/notes/:noteId/summaries',
  validateParams(noteSummariesQuerySchema),
  validateBody(createSummarySchema),
  summaryController.createSummary
);

/**
 * @swagger
 * /api/notes/{noteId}/summaries:
 *   get:
 *     summary: Get all summaries for a note
 *     tags: [Summaries]
 *     parameters:
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Note ID
 *     responses:
 *       200:
 *         description: List of summaries for the note
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
 *                     $ref: '#/components/schemas/Summary'
 *       404:
 *         description: Note not found
 */
router.get(
  '/notes/:noteId/summaries',
  validateParams(noteSummariesQuerySchema),
  summaryController.getSummariesByNote
);

/**
 * @swagger
 * /api/summaries/{id}:
 *   get:
 *     summary: Get a summary by ID
 *     tags: [Summaries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Summary ID
 *     responses:
 *       200:
 *         description: Summary details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Summary'
 *       404:
 *         description: Summary not found
 */
router.get('/summaries/:id', validateParams(summaryIdSchema), summaryController.getSummaryById);

/**
 * @swagger
 * /api/summaries/{id}:
 *   put:
 *     summary: Update a summary
 *     tags: [Summaries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Summary ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateSummary'
 *     responses:
 *       200:
 *         description: Summary updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Summary'
 *       404:
 *         description: Summary not found
 */
router.put(
  '/summaries/:id',
  validateParams(summaryIdSchema),
  validateBody(updateSummarySchema),
  summaryController.updateSummary
);

/**
 * @swagger
 * /api/summaries/{id}:
 *   delete:
 *     summary: Delete a summary
 *     tags: [Summaries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Summary ID
 *     responses:
 *       200:
 *         description: Summary deleted successfully
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
 *         description: Summary not found
 */
router.delete('/summaries/:id', validateParams(summaryIdSchema), summaryController.deleteSummary);

export default router;
