import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import {
  createPostService,
  getAllPostsService,
  getPostByIdService,
  deletePostService,
  addCommentService,
  getCommentsService,
  toggleLikeService,
} from "./post.service";
import { createPostSchema } from "./post.schema";

export const createPost = asyncHandler(
  async (req: Request, res: Response) => {
    const validatedData = createPostSchema.parse(req.body);

    const post = await createPostService(
      req.user!.userId,
      validatedData
    );

    res.status(201).json(post);
  }
);

export const getAllPosts = asyncHandler(
  async (req: Request, res: Response) => {
    const filterUserId = req.query.userId as string | undefined;
    const requestingUserId = req.user?.userId;
    const posts = await getAllPostsService(requestingUserId, filterUserId);
    // Annotate each post with `liked` boolean for the requesting user
    const annotated = posts.map((p: any) => ({
      ...p,
      liked: Array.isArray(p.likes) && p.likes.length > 0,
      likes: undefined, // strip raw likes array — client only needs boolean + count
    }));
    res.json(annotated);
  }
);

export const getPostById = asyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    const post = await getPostByIdService(req.params.id);
    res.json(post);
  }
);

export const deletePost = asyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    const result = await deletePostService(
      req.params.id,
      req.user!.userId
    );

    res.json(result);
  }
);

export const addComment = asyncHandler(
  async (req: Request, res: Response) => {
    const { content } = req.body;
    if (!content?.trim()) {
      res.status(400);
      throw new Error("Comment content is required");
    }
    const comment = await addCommentService(req.params.id as string, req.user!.userId, content);
    res.status(201).json(comment);
  }
);

export const getComments = asyncHandler(
  async (req: Request, res: Response) => {
    const comments = await getCommentsService(req.params.id as string);
    res.json(comments);
  }
);

export const toggleLike = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await toggleLikeService(req.params.id as string, req.user!.userId);
    res.json(result);
  }
);
