import express from "express";
import { authorizeRole } from "../middleware/authorizeRole.js";
import {
  addVenue,
  deleteVenue,
  getVenues,
  updateVenue,
} from "../controllers/venue.controller.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/get", verifyToken, authorizeRole("admin", "organizer"), getVenues);
router.post("/add", verifyToken, authorizeRole("admin"), addVenue);
router.put("/update/:id", verifyToken, authorizeRole("admin"), updateVenue);
router.delete("/delete/:id", verifyToken, authorizeRole("admin"), deleteVenue);

export default router;
