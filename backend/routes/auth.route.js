import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { login } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', signup);

export default router;