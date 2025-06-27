import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import { authorizeRole } from "../middleware/authorizeRole.js";
import { addEvent, approveEventByAdmin, deleteEvent, getEvents, rejectEventByAdmin, updateEvent } from "../controllers/event.controller.js";

const router = express.Router();

router.post("/add", verifyToken, authorizeRole("organizer"), addEvent);
router.get("/get", verifyToken, authorizeRole("admin", "organizer", "attendee"), getEvents );
router.patch('/approve-event/:id', verifyToken, authorizeRole('admin'), approveEventByAdmin);
router.patch('/reject-event/:id', verifyToken, authorizeRole('admin'), rejectEventByAdmin);
router.put('/update/:id', verifyToken, authorizeRole('organizer'), updateEvent);
router.delete('/delete/:id', verifyToken, authorizeRole('organizer'), deleteEvent);


export default router;
