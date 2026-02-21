"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCommunitySchema = exports.createCommunitySchema = void 0;
const zod_1 = require("zod");
exports.createCommunitySchema = zod_1.z.object({
    name: zod_1.z.string().min(3, "Name must be at least 3 characters"),
    description: zod_1.z.string().optional(),
    privacy: zod_1.z.enum(["public", "private"]).optional(),
    icon: zod_1.z.string().optional(),
});
exports.updateCommunitySchema = zod_1.z.object({
    name: zod_1.z.string().min(3).optional(),
    description: zod_1.z.string().optional(),
    privacy: zod_1.z.enum(["public", "private"]).optional(),
    icon: zod_1.z.string().optional(),
});
