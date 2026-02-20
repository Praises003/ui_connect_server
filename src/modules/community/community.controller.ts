import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import {
    createCommunityService,
    getAllCommunitiesService,
    getCommunityByIdService,
    joinCommunityService,
    leaveCommunityService,
    deleteCommunityService,
    getCommunityRequestsService,
    updateCommunityRequestService
} from "./community.service";
import { createCommunitySchema, updateCommunitySchema } from "./community.schema";

export const createCommunity = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = createCommunitySchema.parse(req.body);
    const community = await createCommunityService(req.user!.userId, {
        ...validatedData,
        targetAudience: req.body.targetAudience || "all",
    });
    res.status(201).json(community);
});

export const getAllCommunities = asyncHandler(async (req: Request, res: Response) => {
    const communities = await getAllCommunitiesService(req.user!.userId);
    res.json(communities);
});

export const getCommunityById = asyncHandler(async (req: Request, res: Response) => {
    const community = await getCommunityByIdService(req.params.id as string);
    if (!community) {
        res.status(404);
        throw new Error("Community not found");
    }
    res.json(community);
});

export const joinCommunity = asyncHandler(async (req: Request, res: Response) => {
    const membership = await joinCommunityService(req.user!.userId, req.params.id as string);
    res.json(membership);
});

export const leaveCommunity = asyncHandler(async (req: Request, res: Response) => {
    await leaveCommunityService(req.user!.userId, req.params.id as string);
    res.json({ message: "Left community successfully" });
});

export const deleteCommunity = asyncHandler(async (req: Request, res: Response) => {
    await deleteCommunityService(req.user!.userId, req.params.id as string);
    res.json({ message: "Community deleted successfully" });
});

export const getCommunityRequests = asyncHandler(async (req: Request, res: Response) => {
    const requests = await getCommunityRequestsService(req.user!.userId, req.params.id as string);
    res.json(requests);
});

export const updateCommunityRequest = asyncHandler(async (req: Request, res: Response) => {
    const { action } = req.body;
    if (action !== "APPROVE" && action !== "REJECT") {
        res.status(400);
        throw new Error("Invalid action. Must be APPROVE or REJECT");
    }
    const result = await updateCommunityRequestService(req.user!.userId, req.params.id as string, req.params.userId as string, action);
    res.json(result);
});
