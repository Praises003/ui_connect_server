import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import {
  getProfile,
  updateProfile,
  changePassword,
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

export default router;
