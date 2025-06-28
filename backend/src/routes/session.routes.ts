import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import { authorizeRole } from '../middleware/authorizeRole.js';
import { addSessionForEvent, deleteSessionForEvent, getSessionForEvent, updateSessionForEvent } from '../controllers/session.controller.js';

const router = express.Router();

router.post('/add', verifyToken, authorizeRole('organizer'), addSessionForEvent);
router.get('/get/:eventId', verifyToken, authorizeRole('admin', 'organizer', 'attendee'), getSessionForEvent);
router.put('/update/:id', verifyToken, authorizeRole('organizer'), updateSessionForEvent);
router.delete('/delete/:id', verifyToken, authorizeRole('organizer'), deleteSessionForEvent);

export default router;