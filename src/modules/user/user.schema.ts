import { z } from "zod";

export const updateProfileSchema = z.object({
  fullName: z.string().min(2).max(50).optional(),
  bio: z.string().max(200).optional(),
  avatarUrl: z.string().url().optional(),
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(6),
  newPassword: z.string().min(6),
});
