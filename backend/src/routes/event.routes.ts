import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import { authorizeRole } from "../middleware/authorizeRole.js";
import { addEvent, approveEventByAdmin, getEvents } from "../controllers/event.controller.js";

const router = express.Router();

router.post("/add", verifyToken, authorizeRole("organizer"), addEvent);
router.get("/get", verifyToken, authorizeRole("admin", "organizer", "attendee"), getEvents );
router.patch('/approve-event/:id', verifyToken, authorizeRole('admin'), approveEventByAdmin);

export default router;
