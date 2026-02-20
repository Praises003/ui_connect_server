"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessageSchema = void 0;
const zod_1 = require("zod");
exports.sendMessageSchema = zod_1.z.object({
    recipientId: zod_1.z.string().uuid("Invalid recipient ID"),
    content: zod_1.z.string().min(1, "Message cannot be empty"),
});
