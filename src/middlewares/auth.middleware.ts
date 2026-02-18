import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/token";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Unauthorized - No authorization header",
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Unauthorized - Invalid token format",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = verifyAccessToken(token);

     
    // TypeScript now knows req.user exists due to the fact that i made a declaration file in src/types/express.d.ts
    req.user = decoded as {
      userId: string;
      role: string;
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized - Invalid or expired token",
    });
  }
};
