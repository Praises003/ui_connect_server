"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCommunityService = exports.leaveCommunityService = exports.joinCommunityService = exports.getCommunityByIdService = exports.getAllCommunitiesService = exports.createCommunityService = void 0;
const prisma_1 = require("../../lib/prisma");
const createCommunityService = async (userId, data) => {
    return await prisma_1.prisma.community.create({
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
exports.createCommunityService = createCommunityService;
const getAllCommunitiesService = async () => {
    return await prisma_1.prisma.community.findMany({
        include: {
            _count: { select: { members: true } },
        },
        orderBy: { createdAt: "desc" },
    });
};
exports.getAllCommunitiesService = getAllCommunitiesService;
const getCommunityByIdService = async (id) => {
    return await prisma_1.prisma.community.findUnique({
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
exports.getCommunityByIdService = getCommunityByIdService;
const joinCommunityService = async (userId, communityId) => {
    return await prisma_1.prisma.communityMember.create({
        data: {
            userId,
            communityId,
            role: "MEMBER",
        },
    });
};
exports.joinCommunityService = joinCommunityService;
const leaveCommunityService = async (userId, communityId) => {
    return await prisma_1.prisma.communityMember.deleteMany({
        where: {
            userId,
            communityId,
        },
    });
};
exports.leaveCommunityService = leaveCommunityService;
const deleteCommunityService = async (userId, communityId) => {
    // Check if user is admin/creator first?
    const membership = await prisma_1.prisma.communityMember.findUnique({
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
    return await prisma_1.prisma.community.delete({
        where: { id: communityId }
    });
};
exports.deleteCommunityService = deleteCommunityService;
