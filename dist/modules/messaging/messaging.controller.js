"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = exports.getMessages = exports.getConversations = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const messaging_service_1 = require("./messaging.service");
const messaging_schema_1 = require("./messaging.schema");
exports.getConversations = (0, express_async_handler_1.default)(async (req, res) => {
    const conversations = await (0, messaging_service_1.getConversationsService)(req.user.userId);
    res.json(conversations);
});
exports.getMessages = (0, express_async_handler_1.default)(async (req, res) => {
    // If param is conversationId.
    // Frontend might pass recipientId instead?
    // Let's assume URL is /:conversationId
    const messages = await (0, messaging_service_1.getMessagesService)(req.user.userId, req.params.conversationId);
    res.json(messages);
});
exports.sendMessage = (0, express_async_handler_1.default)(async (req, res) => {
    const { recipientId, content } = messaging_schema_1.sendMessageSchema.parse(req.body);
    const message = await (0, messaging_service_1.sendMessageService)(req.user.userId, recipientId, content);
    res.status(201).json(message);
});
