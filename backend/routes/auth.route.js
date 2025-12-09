import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { signup } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', signup);

export default router;