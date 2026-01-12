import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { createOrUpdateStudentWorks, getAllStudentWorks, deleteStudentWorks } from '../controllers/studentWorks.controller.js';

const router = express.Router();

router.post('/create-student-works', protectRoute, createOrUpdateStudentWorks);
router.get('/get-all-student-works', protectRoute, getAllStudentWorks);
router.delete('/delete-student-works/:id', protectRoute, deleteStudentWorks);

export default router;