"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePostService = exports.getPostByIdService = exports.getAllPostsService = exports.createPostService = void 0;
const prisma_1 = require("../../lib/prisma");
const AppError_1 = require("../../utils/AppError");
/**
 * Create Post
 */
const createPostService = async (userId, data) => {
    const post = await prisma_1.prisma.post.create({
        data: {
            content: data.content,
            imageUrl: data.imageUrl,
            authorId: userId,
        },
        include: {
            author: {
                select: {
                    id: true,
                    fullName: true,
                    avatarUrl: true,
                },
            },
        },
    });
    return post;
};
exports.createPostService = createPostService;
/**
 * Get All Posts (Feed)
 */
const getAllPostsService = async () => {
    return prisma_1.prisma.post.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            author: {
                select: {
                    id: true,
                    fullName: true,
                    avatarUrl: true,
                },
            },
        },
    });
};
exports.getAllPostsService = getAllPostsService;
/**
 * Get Single Post
 */
const getPostByIdService = async (postId) => {
    const post = await prisma_1.prisma.post.findUnique({
        where: { id: postId },
        include: {
            author: {
                select: {
                    id: true,
                    fullName: true,
                    avatarUrl: true,
                },
            },
        },
    });
    if (!post) {
        throw new AppError_1.AppError("Post not found", 404);
    }
    return post;
};
exports.getPostByIdService = getPostByIdService;
/**
 * Delete Post (Owner Only)
 */
const deletePostService = async (postId, userId) => {
    const post = await prisma_1.prisma.post.findUnique({
        where: { id: postId },
    });
    if (!post) {
        throw new AppError_1.AppError("Post not found", 404);
    }
    if (post.authorId !== userId) {
        throw new AppError_1.AppError("Unauthorized to delete this post", 403);
    }
    await prisma_1.prisma.post.delete({
        where: { id: postId },
    });
    return { message: "Post deleted successfully" };
};
exports.deletePostService = deletePostService;
