import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import { authorizeRole } from "../middleware/authorizeRole.js";
import {
  addParticipant,
  getParticipantForEvent,
} from "../controllers/participant.controller.js";

const router = express.Router();

router.post("/add", addParticipant);
router.get(
  "/get/:eventId",
  verifyToken,
  authorizeRole("admin", "organizer", "attendee"),
  getParticipantForEvent
);

export default router;
