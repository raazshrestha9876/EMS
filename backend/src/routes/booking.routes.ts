import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import { authorizeRole } from "../middleware/authorizeRole.js";
import { eventBooking } from "../controllers/booking.controller.js";


const router = express.Router();

router.post('/event-booking', verifyToken, authorizeRole('attendee'), eventBooking);

export default router;