import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import {
    createCommunity,
    getAllCommunities,
    getCommunityById,
    joinCommunity,
    leaveCommunity,
    deleteCommunity,
    getCommunityRequests,
    updateCommunityRequest
} from "./community.controller";
import { getCommunityMessages } from "./community.chat";

const router = Router();

router.use(authenticate);

router.post("/", createCommunity);
router.get("/", getAllCommunities);
router.get("/:id", getCommunityById);
router.post("/:id/join", joinCommunity);
router.post("/:id/leave", leaveCommunity);
router.delete("/:id", deleteCommunity);
router.get("/:id/requests", getCommunityRequests);
router.put("/:id/requests/:userId", updateCommunityRequest);
router.get("/:id/messages", getCommunityMessages);

export default router;
