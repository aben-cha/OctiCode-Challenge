import { Router } from 'express';
import {
  getPatients,
  getPatientByID,
  createPatient,
  updatePatient,
  deletePatient,
} from '@/controllers/patients';

const router = Router();

router.get('/', getPatients);
router.get('/:id', getPatientByID);
router.post('/', createPatient);
router.put('/:id', updatePatient);
router.delete('/:id', deletePatient);

export default router;
