import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import {
  getProfileService,
  updateProfileService,
  changePasswordService,
  getUserByIdService,
  toggleFollowService,
} from "./user.service";
import {
  updateProfileSchema,
  changePasswordSchema,
} from "./user.schema";

export const getProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await getProfileService(req.user!.userId);
    res.json(user);
  }
);

export const updateProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const validatedData = updateProfileSchema.parse(req.body);

    const updatedUser = await updateProfileService(
      req.user!.userId,
      validatedData
    );

    res.json(updatedUser);
  }
);

export const changePassword = asyncHandler(
  async (req: Request, res: Response) => {
    const validatedData = changePasswordSchema.parse(req.body);

    const result = await changePasswordService(
      req.user!.userId,
      validatedData.oldPassword,
      validatedData.newPassword
    );

    res.json(result);
  }
);

export const getUserById = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await getUserByIdService(req.params.id as string, req.user?.userId);
    res.json(user);
  }
);

export const toggleFollow = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await toggleFollowService(req.user!.userId, req.params.id as string);
    res.json(result);
  }
);
