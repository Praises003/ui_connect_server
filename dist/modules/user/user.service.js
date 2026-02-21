"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordService = exports.updateProfileService = exports.getProfileService = void 0;
const prisma_1 = require("../../lib/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const AppError_1 = require("../../utils/AppError");
/**
 * Get current user's profile
 */
const getProfileService = async (userId) => {
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            fullName: true,
            bio: true,
            avatarUrl: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    if (!user) {
        throw new AppError_1.AppError("User not found", 404);
    }
    return user;
};
exports.getProfileService = getProfileService;
/**
 * Update current user's profile
 */
const updateProfileService = async (userId, data) => {
    const updatedUser = await prisma_1.prisma.user.update({
        where: { id: userId },
        data,
        select: {
            id: true,
            email: true,
            fullName: true,
            bio: true,
            avatarUrl: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return updatedUser;
};
exports.updateProfileService = updateProfileService;
/**
 * Change user password
 */
const changePasswordService = async (userId, oldPassword, newPassword) => {
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new AppError_1.AppError("User not found", 404);
    }
    const isMatch = await bcrypt_1.default.compare(oldPassword, user.password);
    if (!isMatch) {
        throw new AppError_1.AppError("Old password is incorrect", 401);
    }
    const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
    await prisma_1.prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
    });
    return { message: "Password updated successfully" };
};
exports.changePasswordService = changePasswordService;
