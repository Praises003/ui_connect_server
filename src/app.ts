import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./modules/auth/auth.routes";
import { globalErrorHandler } from "./middlewares/error.middleware";

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(globalErrorHandler);

app.use("/api/auth", authRoutes);
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app;
