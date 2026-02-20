import { prisma } from "../../lib/prisma";

export const createCommunityService = async (
    userId: string,
    data: { name: string; description?: string; privacy?: "public" | "private"; icon?: string; targetAudience?: string }
) => {
    return await prisma.community.create({
        data: {
            name: data.name,
            privacy: data.privacy || "public",
            description: data.description || "",
            icon: data.icon || "",
            targetAudience: data.targetAudience || "all",
            creatorId: userId,
            members: {
                create: {
                    userId,
                    role: "ADMIN",
                },
            },
        },
        include: {
            creator: { select: { id: true, fullName: true, avatarUrl: true } },
            _count: { select: { members: true } },
        },
    });
};

/**
 * Get communities visible to the current user.
 * - "all" audience communities → always shown
 * - Dept-specific communities → only shown if the user belongs to that dept
 *   OR the user is already a member (so their joined communities still show)
 * The caller can pass showAll=true to skip the dept filter (used for search results).
 */
export const getAllCommunitiesService = async (userId: string) => {
    return await prisma.community.findMany({
        include: {
            members: {
                select: { userId: true, role: true, status: true }
            },
            _count: { select: { members: true } },
        },
        orderBy: { createdAt: "desc" },
    });
};

export const getCommunityByIdService = async (id: string) => {
    return await prisma.community.findUnique({
        where: { id },
        include: {
            members: {
                include: {
                    user: {
                        select: { id: true, fullName: true, avatarUrl: true, department: true, level: true },
                    },
                },
            },
            posts: {
                include: {
                    author: { select: { id: true, fullName: true, avatarUrl: true } },
                    _count: { select: { comments: true, likes: true } },
                },
                orderBy: { createdAt: "desc" },
            },
            _count: { select: { members: true } },
        },
    });
};

export const joinCommunityService = async (userId: string, communityId: string) => {
    const community = await prisma.community.findUnique({ where: { id: communityId } });
    if (!community) {
        throw new Error("Community not found");
    }

    const membership = await prisma.communityMember.findUnique({
        where: { userId_communityId: { userId, communityId } }
    });

    if (membership) {
        throw new Error("Already a member or request pending");
    }

    const status = community.privacy === "private" ? "PENDING" : "APPROVED";

    return await prisma.communityMember.create({
        data: {
            userId,
            communityId,
            role: "MEMBER",
            status,
        },
    });
};

export const leaveCommunityService = async (userId: string, communityId: string) => {
    return await prisma.communityMember.deleteMany({
        where: {
            userId,
            communityId,
        },
    });
};

export const deleteCommunityService = async (userId: string, communityId: string) => {
    // Check if user is admin/creator first?
    const membership = await prisma.communityMember.findUnique({
        where: {
            userId_communityId: {
                userId,
                communityId
            }
        }
    });

    if (!membership || membership.role !== "ADMIN") {
        throw new Error("Unauthorized to delete community");
    }

    return await prisma.community.delete({
        where: { id: communityId }
    });
}

export const getCommunityRequestsService = async (adminId: string, communityId: string) => {
    // Check if user is admin
    const membership = await prisma.communityMember.findUnique({
        where: { userId_communityId: { userId: adminId, communityId } }
    });

    if (!membership || membership.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    return await prisma.communityMember.findMany({
        where: { communityId, status: "PENDING" },
        include: { user: { select: { id: true, fullName: true, avatarUrl: true, department: true } } }
    });
};

export const updateCommunityRequestService = async (adminId: string, communityId: string, targetUserId: string, action: "APPROVE" | "REJECT") => {
    // Check if user is admin
    const adminMembership = await prisma.communityMember.findUnique({
        where: { userId_communityId: { userId: adminId, communityId } }
    });

    if (!adminMembership || adminMembership.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    if (action === "REJECT") {
        return await prisma.communityMember.delete({
            where: { userId_communityId: { userId: targetUserId, communityId } }
        });
    }

    return await prisma.communityMember.update({
        where: { userId_communityId: { userId: targetUserId, communityId } },
        data: { status: "APPROVED" }
    });
};
