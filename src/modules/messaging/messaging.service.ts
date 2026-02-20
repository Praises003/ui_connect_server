import { prisma } from "../../lib/prisma";

export const getConversationsService = async (userId: string) => {
    // Find conversations where user is a participant
    return await prisma.conversation.findMany({
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

export const getMessagesService = async (userId: string, conversationId: string) => {
    // Verify participation
    const participant = await prisma.conversationParticipant.findUnique({
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

    return await prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: "asc" },
        include: {
            sender: {
                select: { id: true, fullName: true, avatarUrl: true },
            },
        },
    });
};

export const getConversationWithUserService = async (userId: string, targetUserId: string) => {
    // Find existing conversation between these two users
    let conversation = await prisma.conversation.findFirst({
        where: {
            AND: [
                { participants: { some: { userId } } },
                { participants: { some: { userId: targetUserId } } },
            ],
        },
        include: {
            participants: {
                include: {
                    user: {
                        select: { id: true, fullName: true, avatarUrl: true, isOnline: true }
                    }
                }
            }
        }
    });

    if (!conversation) {
        // Create new conversation
        conversation = await prisma.conversation.create({
            data: {
                participants: {
                    create: [
                        { userId },
                        { userId: targetUserId }
                    ]
                }
            },
            include: {
                participants: {
                    include: {
                        user: {
                            select: { id: true, fullName: true, avatarUrl: true, isOnline: true }
                        }
                    }
                }
            }
        });
    }

    return conversation;
};

export const sendMessageService = async (senderId: string, recipientId: string, content: string) => {
    // Use the shared service to find or create conversation
    const conversation = await getConversationWithUserService(senderId, recipientId);
    const conversationId = conversation.id;

    // Create message
    const message = await prisma.message.create({
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
    await prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
    });

    return message;
};
