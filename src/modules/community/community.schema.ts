import { z } from "zod";

export const createCommunitySchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    description: z.string().optional(),
    privacy: z.enum(["public", "private"]).optional(),
    icon: z.string().optional(),
});

export const updateCommunitySchema = z.object({
    name: z.string().min(3).optional(),
    description: z.string().optional(),
    privacy: z.enum(["public", "private"]).optional(),
    icon: z.string().optional(),
});
