import { Router } from 'express';
import { validateParams, validateBody } from '@/middlewares/validate';
import { createPatientSchema, updatePatientSchema, patientIdSchema } from '../schemas/validation';
import * as patientController from '@/controllers/patients';

const router = Router();

router.get('/', patientController.getPatients);
router.get('/:id', validateParams(patientIdSchema), patientController.getPatientByID);
router.post('/', validateBody(createPatientSchema), patientController.createPatient);
router.put(
  '/:id',
  validateParams(patientIdSchema),
  validateBody(updatePatientSchema),
  patientController.updatePatient
);
router.delete('/:id', validateParams(patientIdSchema), patientController.deletePatient);

export default router;
