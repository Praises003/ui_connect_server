import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import {
  createPost,
  getAllPosts,
  getPostById,
  deletePost,
} from "./post.controller";

const router = Router();

router.use(authenticate);

router.post("/", createPost);
router.get("/", getAllPosts);
router.get("/:id", getPostById);
router.delete("/:id", deletePost);

export default router;
