import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import {
  createPostService,
  getAllPostsService,
  getPostByIdService,
  deletePostService,
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
  async (_req: Request, res: Response) => {
    const posts = await getAllPostsService();
    res.json(posts);
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
