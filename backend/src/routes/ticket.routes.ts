import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import { authorizeRole } from "../middleware/authorizeRole.js";
import { addTicket, getTicketByEvent } from "../controllers/ticket.controller.js";

const router = express.Router();

router.post('/add', verifyToken, authorizeRole('organizer'), addTicket);
router.get('/get/:eventId', verifyToken, authorizeRole('organizer', 'attendee'), getTicketByEvent);

export default router;