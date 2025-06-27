import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import { authorizeRole } from "../middleware/authorizeRole.js";
import { addFeedback, getFeedbackByEvent } from "../controllers/feedback.controller.js";


const router = express.Router();

router.post('/add', verifyToken, authorizeRole('attendee'), addFeedback);
router.get('/get/:eventId', verifyToken, authorizeRole('organizer', 'attendee', 'admin'), getFeedbackByEvent);

export default router;