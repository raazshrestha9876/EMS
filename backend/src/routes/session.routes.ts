import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import { authorizeRole } from '../middleware/authorizeRole.js';
import { addSessionForEvent, getSessionForEvent } from '../controllers/session.controller.js';

const router = express.Router();

router.post('/add', verifyToken, authorizeRole('organizer'), addSessionForEvent);
router.get('/get/:eventId', verifyToken, authorizeRole('admin', 'organizer', 'attendee'), getSessionForEvent);

export default router;