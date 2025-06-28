import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import { authorizeRole } from '../middleware/authorizeRole.js';
import { addPerformer, deletePerformer, getPerformersForEvent, updatePerformer } from '../controllers/performer.controller.js';

const router = express.Router();

router.post('/add', verifyToken, authorizeRole('organizer'), addPerformer);
router.get('/get/:eventId', verifyToken, authorizeRole('admin', 'organizer'), getPerformersForEvent);
router.put('/update/:id', verifyToken, authorizeRole('organizer'), updatePerformer);
router.delete('/delete/:id', verifyToken, authorizeRole('organizer'), deletePerformer);

export default router;