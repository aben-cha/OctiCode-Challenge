import express from 'express';
import { validateBody, validateParams } from '../middlewares/validate';
import {
  createSummarySchema,
  updateSummarySchema,
  summaryIdSchema,
  noteSummariesQuerySchema,
} from '../schemas/validation';
import * as summaryController from '../controllers/summaries';

const router = express.Router();

// Create summary for a note
router.post(
  '/notes/:noteId/summaries',
  validateParams(noteSummariesQuerySchema),
  validateBody(createSummarySchema),
  summaryController.createSummary
);

// Get all summaries for a note
router.get(
  '/notes/:noteId/summaries',
  validateParams(noteSummariesQuerySchema),
  summaryController.getSummariesByNote
);

// Get summary by ID
router.get('/summaries/:id', validateParams(summaryIdSchema), summaryController.getSummaryById);

// Update summary
router.put(
  '/summaries/:id',
  validateParams(summaryIdSchema),
  validateBody(updateSummarySchema),
  summaryController.updateSummary
);

// Delete summary
router.delete('/summaries/:id', validateParams(summaryIdSchema), summaryController.deleteSummary);

export default router;
