import { Request, Response } from 'express';

export function getPatients(req: Request, res: Response) {
  res.json([]);
}

export function getPatientByID(req: Request, res: Response) {
  res.json({ id: req.params.id });
}

export function createPatient(req: Request, res: Response) {
  res.status(201).json(req.body);
}

export function updatePatient(req: Request, res: Response) {
  res.json({ id: req.params.id, ...req.body });
}

export function deletePatient(req: Request, res: Response) {
  res.status(204).json({ message: 'deletePatient' });
}
