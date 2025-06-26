import express from "express";
import { authorizeRole } from "../middleware/authorizeRole.js";
import { addVenue, getVenues } from "../controllers/venue.controller.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/get", verifyToken, authorizeRole("admin", "organizer"), getVenues);
router.post("/add", verifyToken, authorizeRole("admin"), addVenue);

export default router;
