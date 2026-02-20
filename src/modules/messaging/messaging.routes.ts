import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import {
    getConversations,
    getMessages,
    sendMessage,
    getConversationWithUser,
} from "./messaging.controller";

const router = Router();

router.use(authenticate);

router.get("/conversations", getConversations);
router.get("/user/:userId", getConversationWithUser);
router.get("/:conversationId", getMessages);
router.post("/", sendMessage);

export default router;
