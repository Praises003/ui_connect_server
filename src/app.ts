import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/user/user.routes";
import postsRoutes from "./modules/posts/posts.routes";
import communityRoutes from "./modules/community/community.routes";
import messagingRoutes from "./modules/messaging/messaging.routes";
import notificationsRoutes from "./modules/notifications/notifications.routes";
import { globalErrorHandler } from "./middlewares/error.middleware";

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(globalErrorHandler);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postsRoutes)
app.use("/api/communities", communityRoutes);
app.use("/api/messages", messagingRoutes);
app.use("/api/notifications", notificationsRoutes);
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app;
