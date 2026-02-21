import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";

interface CreatePostInput {
  content: string;
  imageUrl?: string;
  authorId?: string; // resolved in controller
}

/**
 * Create Post
 */
export const createPostService = async (
  userId: string,
  data: CreatePostInput
) => {
  const post = await prisma.post.create({
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

/**
 * Get All Posts (Feed)
 */
export const getAllPostsService = async (requestingUserId?: string, filterUserId?: string) => {
  return prisma.post.findMany({
    where: filterUserId ? { authorId: filterUserId } : {},
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: {
          id: true,
          fullName: true,
          avatarUrl: true,
          username: true,
          department: true,
        },
      },
      _count: {
        select: {
          likes: true,
          comments: true
        }
      },
      // Include whether the requesting user liked this post
      likes: requestingUserId
        ? { where: { userId: requestingUserId }, select: { userId: true } }
        : false,
    },
  });
};

/**
 * Get Single Post
 */
export const getPostByIdService = async (postId: string) => {
  const post = await prisma.post.findUnique({
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
    throw new AppError("Post not found", 404);
  }

  return post;
};

/**
 * Delete Post (Owner Only)
 */
export const deletePostService = async (
  postId: string,
  userId: string
) => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  if (post.authorId !== userId) {
    throw new AppError("Unauthorized to delete this post", 403);
  }

  await prisma.post.delete({
    where: { id: postId },
  });

  return { message: "Post deleted successfully" };
};

/**
 * Add Comment to Post
 */
export const addCommentService = async (postId: string, userId: string, content: string) => {
  const comment = await prisma.comment.create({
    data: { content, postId, authorId: userId },
    include: {
      author: { select: { id: true, fullName: true, avatarUrl: true, username: true } },
    },
  });
  return comment;
};

/**
 * Get Comments for a Post
 */
export const getCommentsService = async (postId: string) => {
  return prisma.comment.findMany({
    where: { postId },
    orderBy: { createdAt: "asc" },
    include: {
      author: { select: { id: true, fullName: true, avatarUrl: true, username: true } },
    },
  });
};

/**
 * Toggle Like on a Post
 */
export const toggleLikeService = async (postId: string, userId: string) => {
  const existing = await prisma.like.findUnique({
    where: { postId_userId: { postId, userId } },
  });

  if (existing) {
    await prisma.like.delete({ where: { postId_userId: { postId, userId } } });
  } else {
    await prisma.like.create({ data: { userId, postId } });
  }

  const count = await prisma.like.count({ where: { postId } });
  return { liked: !existing, likeCount: count };
};
