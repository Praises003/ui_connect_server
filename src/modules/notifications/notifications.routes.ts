import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { getNotifications, markAllRead, markOneRead } from "./notifications.controller";

const router = Router();

router.use(authenticate);

router.get("/", getNotifications);
router.patch("/read-all", markAllRead);
router.patch("/:id/read", markOneRead);

export default router;
