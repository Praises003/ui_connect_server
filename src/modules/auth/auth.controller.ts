import { Request, Response } from "express";
import { registerUser, loginUser, refreshUserToken } from "./auth.service";
import { registerSchema, loginSchema } from "./auth.schema";
import asyncHandler from "express-async-handler";
import { AppError } from "../../utils/AppError";
export const register = async (req: Request, res: Response) => {
  try {
    const validatedData = registerSchema.parse(req.body);

    const user = await registerUser(validatedData);

    res.status(201).json({
      message: "User created successfully",
      user
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const result = await loginUser(
      validatedData.email,
      validatedData.password
    );

    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const refresh = asyncHandler(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError("Refresh token required", 400);
    }

    const tokens = await refreshUserToken(refreshToken);

    res.json(tokens);
  }
);
