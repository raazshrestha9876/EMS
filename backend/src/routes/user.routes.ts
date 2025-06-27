import express from "express";
import { deleteUser, getProfile, getUsers, updateProfile } from "../controllers/user.controller.js";
import verifyToken from "../middleware/verifyToken.js";
import { authorizeRole } from "../middleware/authorizeRole.js";

const router = express.Router();

router.get("/get-profile", verifyToken, authorizeRole('admin', 'attendee', 'organizer'),  getProfile);
router.post("/update-profile", verifyToken, authorizeRole('admin', 'attendee', 'organizer'),  updateProfile);
router.get('/get-users',verifyToken, authorizeRole('admin'), getUsers);
router.get('/delete-user', verifyToken, authorizeRole('organizer', 'attendee'), deleteUser);

export default router;
