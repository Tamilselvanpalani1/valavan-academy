import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { createCourse, deleteCourse, getAllCourses, updateCourse } from '../controllers/course.controller.js';
import { verifyAdmin } from '../middleware/verifyAdmin.js';

const router = express.Router();

router.post('/create', protectRoute, createCourse);
router.delete('/:id', protectRoute, deleteCourse);
router.get('/all', protectRoute, getAllCourses);
router.post('/updateCourse/:courseId', protectRoute, updateCourse);


export default router;