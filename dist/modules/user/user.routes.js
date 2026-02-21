"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const user_controller_1 = require("./user.controller");
const router = (0, express_1.Router)();
// All routes below require authentication
router.use(auth_middleware_1.authenticate);
// GET /api/users/me
router.get("/me", user_controller_1.getProfile);
// PATCH /api/users/me
router.patch("/me", user_controller_1.updateProfile);
// PATCH /api/users/me/password
router.patch("/me/password", user_controller_1.changePassword);
exports.default = router;
