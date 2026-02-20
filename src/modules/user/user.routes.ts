import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import {
  getProfile,
  updateProfile,
  changePassword,
  getUserById,
  toggleFollow,
} from "./user.controller";

const router = Router();

// All routes below require authentication
router.use(authenticate);

// GET /api/users/me
router.get("/me", getProfile);

// PATCH /api/users/me
router.patch("/me", updateProfile);

// PATCH /api/users/me/password
router.patch("/me/password", changePassword);

// GET /api/users/:id
router.get("/:id", getUserById);

// POST /api/users/:id/follow  (toggle follow/unfollow)
router.post("/:id/follow", toggleFollow);

export default router;
