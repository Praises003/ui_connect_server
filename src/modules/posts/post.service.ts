import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";

interface CreatePostInput {
  content: string;
  imageUrl?: string;
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
export const getAllPostsService = async () => {
  return prisma.post.findMany({
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
