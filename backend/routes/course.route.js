import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { createCourse } from '../controllers/course.controller.js';
import { verifyAdmin } from '../middleware/verifyAdmin.js';

const router = express.Router();

router.post('/create', protectRoute, createCourse);

export default router;