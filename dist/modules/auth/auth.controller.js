"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refresh = exports.login = exports.register = void 0;
const auth_service_1 = require("./auth.service");
const auth_schema_1 = require("./auth.schema");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const AppError_1 = require("../../utils/AppError");
const register = async (req, res) => {
    try {
        const validatedData = auth_schema_1.registerSchema.parse(req.body);
        const user = await (0, auth_service_1.registerUser)(validatedData);
        res.status(201).json({
            message: "User created successfully",
            user
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const validatedData = auth_schema_1.loginSchema.parse(req.body);
        const result = await (0, auth_service_1.loginUser)(validatedData.email, validatedData.password);
        res.json(result);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.login = login;
exports.refresh = (0, express_async_handler_1.default)(async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        throw new AppError_1.AppError("Refresh token required", 400);
    }
    const tokens = await (0, auth_service_1.refreshUserToken)(refreshToken);
    res.json(tokens);
});
