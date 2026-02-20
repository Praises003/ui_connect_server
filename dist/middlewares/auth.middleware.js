"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const token_1 = require("../utils/token");
const authenticate = (req, res, next) => {
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
        const decoded = (0, token_1.verifyAccessToken)(token);
        // TypeScript now knows req.user exists due to the fact that i made a declaration file in src/types/express.d.ts
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({
            message: "Unauthorized - Invalid or expired token",
        });
    }
};
exports.authenticate = authenticate;
