import { z } from "zod";

export const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  fullName: z.string().min(2),
  department: z.string().min(2, "Department is required"),
  level: z.coerce.number().int().min(100).max(900),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6)
});
