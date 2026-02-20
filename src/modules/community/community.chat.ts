import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { prisma } from "../../lib/prisma";

/**
 * GET /api/communities/:id/messages
 * Returns the last 100 messages for a community (members only)
 */
export const getCommunityMessages = asyncHandler(async (req: Request, res: Response) => {
    const communityId = req.params.id as string;
    const userId = req.user!.userId;

    // Verify the user is a member
    const membership = await prisma.communityMember.findUnique({
        where: { userId_communityId: { userId, communityId } },
    });

    if (!membership || membership.status !== "APPROVED") {
        res.status(403);
        throw new Error("Not a member of this community");
    }

    const messages = await prisma.communityMessage.findMany({
        where: { communityId },
        orderBy: { createdAt: "asc" },
        take: 100,
        include: {
            sender: {
                select: { id: true, fullName: true, avatarUrl: true, username: true },
            },
        },
    });

    res.json(messages);
});
