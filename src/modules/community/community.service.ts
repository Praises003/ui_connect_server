import { prisma } from "../../lib/prisma";

export const createCommunityService = async (
    userId: string,
    data: { name: string; description?: string; privacy?: "public" | "private"; icon?: string }
) => {
    return await prisma.community.create({
        data: {
            ...data,
            privacy: data.privacy || "public",
            description: data.description || "",
            icon: data.icon || "",
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

export const getAllCommunitiesService = async () => {
    return await prisma.community.findMany({
        include: {
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
    return await prisma.communityMember.create({
        data: {
            userId,
            communityId,
            role: "MEMBER",
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
