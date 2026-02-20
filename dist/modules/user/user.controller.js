"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.updateProfile = exports.getProfile = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const user_service_1 = require("./user.service");
const user_schema_1 = require("./user.schema");
exports.getProfile = (0, express_async_handler_1.default)(async (req, res) => {
    const user = await (0, user_service_1.getProfileService)(req.user.userId);
    res.json(user);
});
exports.updateProfile = (0, express_async_handler_1.default)(async (req, res) => {
    const validatedData = user_schema_1.updateProfileSchema.parse(req.body);
    const updatedUser = await (0, user_service_1.updateProfileService)(req.user.userId, validatedData);
    res.json(updatedUser);
});
exports.changePassword = (0, express_async_handler_1.default)(async (req, res) => {
    const validatedData = user_schema_1.changePasswordSchema.parse(req.body);
    const result = await (0, user_service_1.changePasswordService)(req.user.userId, validatedData.oldPassword, validatedData.newPassword);
    res.json(result);
});
