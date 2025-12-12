import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { createCourse, deleteCourse } from '../controllers/course.controller.js';
import { verifyAdmin } from '../middleware/verifyAdmin.js';

const router = express.Router();

router.post('/create', protectRoute, createCourse);
router.delete('/:id', protectRoute, deleteCourse);


export default router;