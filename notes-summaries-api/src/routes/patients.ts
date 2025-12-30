import { Router } from 'express';
import { validateParams, validateBody } from '../middlewares/validate';
import { createPatientSchema, updatePatientSchema, patientIdSchema } from '../schemas/validation';
import * as patientController from '../controllers/patients';

const router = Router();

// Get all patients
router.get('/', patientController.getAllPatients);

// Get patient by ID
router.get('/:id', validateParams(patientIdSchema), patientController.getPatientById);

// Create patient
router.post('/', validateBody(createPatientSchema), patientController.createPatient);

// Update patient
router.put(
  '/:id',
  validateParams(patientIdSchema),
  validateBody(updatePatientSchema),
  patientController.updatePatient
);

// Delete patient
router.delete('/:id', validateParams(patientIdSchema), patientController.deletePatient);

export default router;
