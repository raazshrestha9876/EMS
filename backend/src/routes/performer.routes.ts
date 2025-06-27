import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import { authorizeRole } from '../middleware/authorizeRole.js';
import { addPerformer, getPerformersForEvent } from '../controllers/performer.controller.js';

const router = express.Router();

router.post('/add', verifyToken, authorizeRole('organizer'), addPerformer);
router.get('/get/:eventId', verifyToken, authorizeRole('admin', 'organizer'), getPerformersForEvent);

export default router;