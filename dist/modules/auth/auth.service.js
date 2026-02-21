"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshUserToken = exports.loginUser = exports.registerUser = void 0;
const prisma_1 = require("../../lib/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_1 = require("../../utils/token");
const AppError_1 = require("../../utils/AppError");
const registerUser = async (data) => {
    const existingUser = await prisma_1.prisma.user.findUnique({
        where: { email: data.email }
    });
    if (existingUser) {
        throw new Error("User already exists");
    }
    const hashedPassword = await bcrypt_1.default.hash(data.password, 10);
    const user = await prisma_1.prisma.user.create({
        data: {
            email: data.email,
            password: hashedPassword,
            fullName: data.fullName
        }
    });
    return user;
};
exports.registerUser = registerUser;
const loginUser = async (email, password) => {
    const user = await prisma_1.prisma.user.findUnique({
        where: { email },
    });
    if (!user) {
        throw new AppError_1.AppError("Invalid credentials", 401);
    }
    const isMatch = await bcrypt_1.default.compare(password, user.password);
    if (!isMatch) {
        throw new AppError_1.AppError("Invalid credentials", 401);
    }
    const payload = {
        userId: user.id,
        role: user.role,
    };
    const accessToken = (0, token_1.generateAccessToken)(payload);
    const refreshToken = (0, token_1.generateRefreshToken)(payload);
    // Store refresh token in DB
    await prisma_1.prisma.user.update({
        where: { id: user.id },
        data: { refreshToken },
    });
    const { password: _, refreshToken: __, ...safeUser } = user;
    return {
        accessToken,
        refreshToken,
        user: safeUser,
    };
};
exports.loginUser = loginUser;
const refreshUserToken = async (token) => {
    const decoded = (0, token_1.verifyRefreshToken)(token);
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: decoded.userId },
    });
    if (!user || user.refreshToken !== token) {
        throw new AppError_1.AppError("Invalid refresh token", 403);
    }
    const payload = {
        userId: user.id,
        role: user.role,
    };
    const newAccessToken = (0, token_1.generateAccessToken)(payload);
    const newRefreshToken = (0, token_1.generateRefreshToken)(payload);
    await prisma_1.prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: newRefreshToken },
    });
    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
    };
};
exports.refreshUserToken = refreshUserToken;
