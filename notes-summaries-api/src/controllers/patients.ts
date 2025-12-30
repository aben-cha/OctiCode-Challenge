import { NextFunction, Request, Response } from 'express';
import * as patientService from '../services/patients';
import { CreatePatientInput, UpdatePatientInput } from '@/schemas/validation';

export function getAllPatients(req: Request, res: Response, next: NextFunction) {
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
      return res.status(404).json({
        success: false,
        error: 'Patient not found',
      });
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
  } catch (error: any) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({
        success: false,
        error: 'Medical record number already exists',
      });
    }

    next(error); // Pass to error handler middleware
  }
}

export function updatePatient(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const patient = patientService.update(Number(id), req.body as UpdatePatientInput);

    if (!patient) {
      return res.status(404).json({
        success: false,
        error: 'Patient not found',
      });
    }

    res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (error: any) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({
        success: false,
        error: 'Medical record number already exists',
      });
    }

    next(error);
  }
}

export function deletePatient(req: Request, res: Response, next: NextFunction) {
  try {
    const deletePatient = patientService.remove(Number(req.params.id));
    if (!deletePatient) {
      return res.status(404).json({
        success: false,
        error: 'Patient not found',
      });
    }
    res.status(204).json({
      success: true,
      message: `Patient deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
}
