import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { createTestimonial, getAllTestimonials, deleteTestimonial, updateTestimonial } from '../controllers/testimonials.controller.js';

const router = express.Router();

router.post('/create-testimonial', protectRoute, createTestimonial);
router.get('/get-all-testimonials', protectRoute, getAllTestimonials);
router.delete('/delete-testimonial/:id', protectRoute, deleteTestimonial);
router.put('/update-testimonial/:id', protectRoute, updateTestimonial);

export default router;