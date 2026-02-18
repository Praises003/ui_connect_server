import { Request, Response, NextFunction } from "express";
import { Role } from "../constants/roles";

export const authorize = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized - Not authenticated",
      });
    }

    if (!allowedRoles.includes(req.user.role as Role)) {
      return res.status(403).json({
        message: "Forbidden - Insufficient permissions",
      });
    }

    next();
  };
};
