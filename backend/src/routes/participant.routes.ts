import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import { authorizeRole } from "../middleware/authorizeRole.js";
import {
  addParticipant,
  deleteParticipant,
  getParticipantForEvent,
  updateParticipant,
} from "../controllers/participant.controller.js";

const router = express.Router();

router.post("/add", addParticipant);
router.get("/get/:eventId", verifyToken, authorizeRole("admin", "organizer", "attendee"), getParticipantForEvent);
router.put("update/:id", verifyToken, authorizeRole("admin", "organizer"), updateParticipant);
router.delete("/delete/:id", verifyToken, authorizeRole("admin", "organizer"), deleteParticipant);

export default router;
