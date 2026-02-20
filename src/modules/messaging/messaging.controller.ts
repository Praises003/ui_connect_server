import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import {
    getConversationsService,
    getMessagesService,
    sendMessageService,
    getConversationWithUserService,
} from "./messaging.service";
import { sendMessageSchema } from "./messaging.schema";

export const getConversationWithUser = asyncHandler(async (req: Request, res: Response) => {
    const conversation = await getConversationWithUserService(req.user!.userId, req.params.userId as string);
    res.json(conversation);
});

export const getConversations = asyncHandler(async (req: Request, res: Response) => {
    const conversations = await getConversationsService(req.user!.userId);
    res.json(conversations);
});

export const getMessages = asyncHandler(async (req: Request, res: Response) => {
    // If param is conversationId.
    // Frontend might pass recipientId instead?
    // Let's assume URL is /:conversationId
    const messages = await getMessagesService(req.user!.userId, req.params.conversationId as string);
    res.json(messages);
});

export const sendMessage = asyncHandler(async (req: Request, res: Response) => {
    const { recipientId, content } = sendMessageSchema.parse(req.body);
    const message = await sendMessageService(req.user!.userId, recipientId, content);
    res.status(201).json(message);
});
