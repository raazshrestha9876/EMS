import express from "express";
import { getProfile, getUsers, updateProfile } from "../controllers/user.controller.js";
import verifyToken from "../middleware/verifyToken.js";
import { authorizeRole } from "../middleware/authorizeRole.js";

const router = express.Router();

router.get("/get-profile", verifyToken, authorizeRole('admin', 'attendee', 'organizer'),  getProfile);
router.post("/update-profile", verifyToken, authorizeRole('admin', 'attendee', 'organizer'),  updateProfile);
router.get('/get-users', authorizeRole('admin'), getUsers);

export default router;
