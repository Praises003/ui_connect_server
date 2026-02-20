"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessageService = exports.getMessagesService = exports.getConversationsService = void 0;
const prisma_1 = require("../../lib/prisma");
const getConversationsService = async (userId) => {
    // Find conversations where user is a participant
    return await prisma_1.prisma.conversation.findMany({
        where: {
            participants: {
                some: { userId },
            },
        },
        include: {
            participants: {
                include: {
                    user: {
                        select: { id: true, fullName: true, avatarUrl: true, isOnline: true }
                    }
                }
            },
            messages: {
                orderBy: { createdAt: "desc" },
                take: 1,
            },
        },
        orderBy: { updatedAt: "desc" },
    });
};
exports.getConversationsService = getConversationsService;
const getMessagesService = async (userId, conversationId) => {
    // Verify participation
    const participant = await prisma_1.prisma.conversationParticipant.findUnique({
        where: {
            userId_conversationId: {
                userId,
                conversationId,
            },
        },
    });
    if (!participant) {
        throw new Error("Unauthorized to access conversation");
    }
    return await prisma_1.prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: "asc" },
        include: {
            sender: {
                select: { id: true, fullName: true, avatarUrl: true },
            },
        },
    });
};
exports.getMessagesService = getMessagesService;
const sendMessageService = async (senderId, recipientId, content) => {
    // Check if conversation exists
    // For DM, we need to find a conversation with ONLY these two participants?
    // Or just any conversation with them? Usually DMs are unique pair.
    // Complex query: find conversation where participants has sender AND recipient AND count is 2.
    // Converting this to prisma query is tricky.
    // Simpler approach: Check if they have a DM conversation ID stored? No.
    // "Find first conversation where participants some userId=A AND participants some userId=B"
    // Let's try to find an existing conversation
    const existingConversation = await prisma_1.prisma.conversation.findFirst({
        where: {
            AND: [
                { participants: { some: { userId: senderId } } },
                { participants: { some: { userId: recipientId } } },
            ],
        },
    });
    let conversationId = existingConversation?.id;
    if (!conversationId) {
        // Create new conversation
        const newConversation = await prisma_1.prisma.conversation.create({
            data: {
                participants: {
                    create: [
                        { userId: senderId },
                        { userId: recipientId }
                    ]
                }
            },
        });
        conversationId = newConversation.id;
    }
    // Create message
    const message = await prisma_1.prisma.message.create({
        data: {
            content,
            senderId,
            conversationId,
        },
        include: {
            sender: { select: { id: true, fullName: true, avatarUrl: true } }
        }
    });
    // Update conversation timestamp
    await prisma_1.prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
    });
    return message;
};
exports.sendMessageService = sendMessageService;
