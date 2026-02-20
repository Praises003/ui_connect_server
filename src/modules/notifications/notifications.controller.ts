import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { getNotificationsService, markAllReadService, markOneReadService } from "./notifications.service";

export const getNotifications = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const notifications = await getNotificationsService(userId);
    res.json(notifications);
});

export const markAllRead = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    await markAllReadService(userId);
    res.json({ success: true });
});

export const markOneRead = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { id } = req.params;
    await markOneReadService(id, userId);
    res.json({ success: true });
});
