import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import {
    createCommunity,
    getAllCommunities,
    getCommunityById,
    joinCommunity,
    leaveCommunity,
    deleteCommunity
} from "./community.controller";

const router = Router();

router.use(authenticate);

router.post("/", createCommunity);
router.get("/", getAllCommunities);
router.get("/:id", getCommunityById);
router.post("/:id/join", joinCommunity);
router.post("/:id/leave", leaveCommunity);
router.delete("/:id", deleteCommunity);

export default router;
