import { Request, Response, NextFunction } from 'express';
import * as summaryService from '../services/summaries';
import * as noteService from '../services/notes';
import { CreateSummaryInput, UpdateSummaryInput } from '../schemas/validation';

export const createSummary = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { noteId } = req.params;

    // Check if note exists
    const note = noteService.findById(Number(noteId));
    if (!note) {
      return res.status(404).json({
        success: false,
        error: 'Note not found',
      });
    }

    const summary = summaryService.create(Number(noteId), req.body as CreateSummaryInput);

    res.status(201).json({
      success: true,
      data: summary,
    });
  } catch (error: any) {
    if (error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
      return res.status(404).json({
        success: false,
        error: 'Invalid note ID',
      });
    }
    next(error);
  }
};

export const getSummariesByNote = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { noteId } = req.params;

    // Check if note exists
    const note = noteService.findById(Number(noteId));
    if (!note) {
      return res.status(404).json({
        success: false,
        error: 'Note not found',
      });
    }

    const summaries = summaryService.findByNote(Number(noteId));

    res.status(200).json({
      success: true,
      count: summaries.length,
      data: summaries,
    });
  } catch (error) {
    next(error);
  }
};

export const getSummaryById = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const summary = summaryService.findById(Number(id));

    if (!summary) {
      return res.status(404).json({
        success: false,
        error: 'Summary not found',
      });
    }

    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSummary = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const summary = summaryService.update(Number(id), req.body as UpdateSummaryInput);

    if (!summary) {
      return res.status(404).json({
        success: false,
        error: 'Summary not found',
      });
    }

    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSummary = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const deleted = summaryService.remove(Number(id));

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Summary not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Summary deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
