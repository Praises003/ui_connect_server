import { prisma } from "../../lib/prisma";

/** Fetch unread (and recent read) notifications for a user */
export const getNotificationsService = async (userId: string) => {
    return prisma.userNotification.findMany({
        where: { recipientId: userId },
        orderBy: { createdAt: "desc" },
        take: 30,
        include: {
            actor: {
                select: { id: true, fullName: true, avatarUrl: true },
            },
        },
    });
};

/** Mark all notifications as read */
export const markAllReadService = async (userId: string) => {
    return prisma.userNotification.updateMany({
        where: { recipientId: userId, read: false },
        data: { read: true },
    });
};

/** Mark a single notification as read */
export const markOneReadService = async (notifId: string, userId: string) => {
    return prisma.userNotification.updateMany({
        where: { id: notifId, recipientId: userId },
        data: { read: true },
    });
};

/** Helper: create a notification (called from other services) */
export const createNotification = async (data: {
    recipientId: string;
    actorId?: string;
    type: string;
    message: string;
    postId?: string;
    communityId?: string;
}) => {
    // Don't notify yourself
    if (data.actorId && data.actorId === data.recipientId) return;
    return prisma.userNotification.create({ data });
};
