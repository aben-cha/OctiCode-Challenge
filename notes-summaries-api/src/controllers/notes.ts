import { NextFunction, Request, Response } from 'express';
import * as noteService from '../services/notes';
import * as patientService from '../services/patients';
import { CreateNoteInput, UpdateNoteInput } from '../schemas/validation';

export function getNoteById(req: Request, res: Response, next: NextFunction) {
  try {
    const note = noteService.findById(Number(req.params.id));

    if (!note) {
      res.status(404).json({
        success: false,
        error: 'Note not found',
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: note,
    });
  } catch (error) {
    next(error);
  }
}

export function createNote(req: Request, res: Response, next: NextFunction) {
  try {
    const patientId = Number(req.params.patientId);
    const note = noteService.create(patientId, req.body as CreateNoteInput);
    res.status(201).json({
      success: true,
      data: note,
    });
  } catch (error) {
    next(error);
  }
}

export function getNotesByPatient(req: Request, res: Response, next: NextFunction) {
  try {
    const { patientId } = req.params;
    const patient = patientService.findById(Number(patientId));
    if (!patient) {
      res.status(404).json({
        success: false,
        error: 'Patient not found',
      });
      return;
    }
    const notes = noteService.findByPatient(Number(req.params.patientId));
    res.status(200).json({
      success: true,
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    next(error);
  }
}

export function updateNote(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const note = noteService.update(Number(id), req.body as UpdateNoteInput);

    if (!note) {
      res.status(404).json({
        success: false,
        error: 'Note not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: note,
    });
  } catch (error) {
    next(error);
  }
}

export function deleteNote(req: Request, res: Response, next: NextFunction) {
  try {
    const note = noteService.remove(Number(req.params.id));
    if (!note) {
      res.status(404).json({
        success: false,
        error: 'Note not found',
      });
      return;
    }
    res.status(204).json({
      success: true,
      message: 'Note deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}
