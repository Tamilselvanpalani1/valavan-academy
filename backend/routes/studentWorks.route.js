import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { createStudentWorks, getAllStudentWorks, deleteStudentWorks } from '../controllers/studentWorks.controller.js';

const router = express.Router();

router.post('/create-student-works', protectRoute, createStudentWorks);
router.get('/get-all-student-works', protectRoute, getAllStudentWorks);
router.delete('/delete-student-works/:id', protectRoute, deleteStudentWorks);

export default router;