import { NextFunction, Request, Response } from 'express';
import * as patientService from '../services/patients';
import { CreatePatientInput, UpdatePatientInput } from '../schemas/validation';

interface SqliteError extends Error {
  code?: string;
}

export function getAllPatients(_req: Request, res: Response, next: NextFunction) {
  try {
    const patients = patientService.findAll();
    res.status(200).json({
      success: true,
      count: patients.length,
      data: patients,
    });
  } catch (error) {
    next(error);
  }
}

export function getPatientById(req: Request, res: Response, next: NextFunction) {
  try {
    const patient = patientService.findById(Number(req.params.id));

    if (!patient) {
      res.status(404).json({
        success: false,
        error: 'Patient not found',
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    next(error);
  }
}

export function createPatient(req: Request, res: Response, next: NextFunction) {
  try {
    const patient = patientService.create(req.body as CreatePatientInput);
    res.status(201).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    if ((error as SqliteError).code === 'SQLITE_CONSTRAINT_UNIQUE') {
      res.status(409).json({
        success: false,
        error: 'Medical record number already exists',
      });
      return;
    }

    next(error);
  }
}

export function updatePatient(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const patient = patientService.update(Number(id), req.body as UpdatePatientInput);

    if (!patient) {
      res.status(404).json({
        success: false,
        error: 'Patient not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (error: any) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      res.status(409).json({
        success: false,
        error: 'Medical record number already exists',
      });
      return;
    }

    next(error);
  }
}

export function deletePatient(req: Request, res: Response, next: NextFunction) {
  try {
    const deletePatient = patientService.remove(Number(req.params.id));
    if (!deletePatient) {
      res.status(404).json({
        success: false,
        error: 'Patient not found',
      });
      return;
    }
    res.status(204).json({
      success: true,
      message: `Patient deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
}
