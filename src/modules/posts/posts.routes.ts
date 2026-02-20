import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import {
  createPost,
  getAllPosts,
  getPostById,
  deletePost,
  addComment,
  getComments,
  toggleLike,
} from "./post.controller";

const router = Router();

router.use(authenticate);

router.post("/", createPost);
router.get("/", getAllPosts);
router.get("/:id", getPostById);
router.delete("/:id", deletePost);
router.post("/:id/comments", addComment);
router.get("/:id/comments", getComments);
router.post("/:id/like", toggleLike);

export default router;
