import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import path from "path";
import { connectDB } from "./config/db";
import "./config/cloudinary";

// ─── Route imports ─────────────────────────────────────────
import authRoutes from "./routes/auth.routes";
import notificationRoutes from "./routes/notification.routes";
import activityRoutes from "./routes/activity.routes";
import eventRoutes from "./routes/event.routes";
import galleryRoutes from "./routes/gallery.routes";
import publicationRoutes from "./routes/publication.routes";
import policyRoutes from "./routes/policy.routes";
import downloadRoutes from "./routes/download.routes";
import contactRoutes from "./routes/contact.routes";
import membershipRoutes from "./routes/membership.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = new Set(
  [
    process.env.FRONTEND_URL,
    ...(process.env.FRONTEND_URLS?.split(",") || []),
    "https://pbvm-purulia-branch.vercel.app",
    "http://localhost:3000",
  ]
    .map((origin) => origin?.trim())
    .filter((origin): origin is string => Boolean(origin))
);

// ─── Security Middleware ───────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: false,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 204,
  })
);

// ─── Global Rate Limiter ───────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests. Please try again later." },
});
app.use(globalLimiter);

// ─── Body Parsers ──────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ─── Static Files for Uploads ──────────────────────────────
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

// ─── Health Check ──────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ success: true, message: "PBVM Purulia API is running", timestamp: new Date() });
});

// ─── API Routes ────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/publications", publicationRoutes);
app.use("/api/policy", policyRoutes);
app.use("/api/downloads", downloadRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/membership", membershipRoutes);

// ─── 404 Handler ───────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ─── Global Error Handler ──────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("[ERROR]", err.message);
  res.status(500).json({ success: false, message: "Internal server error" });
});

// ─── Start Server ──────────────────────────────────────────
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`✅ PBVM Purulia API running on http://localhost:${PORT}`);
    console.log(`📦 Environment: ${process.env.NODE_ENV}`);
  });
};

startServer();

export default app;
