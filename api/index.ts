import express from "express";
import { registerRoutes } from "./routes";

const app = express();

// ---------------------------------------------------------------------------
// Body parsing
// ---------------------------------------------------------------------------
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// ---------------------------------------------------------------------------
// CORS — allow all origins (adjust if needed for production)
// ---------------------------------------------------------------------------
app.use((_req: any, res: any, next: any) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  next();
});

// Handle preflight OPTIONS requests
app.options("*", (_req: any, res: any) => {
  res.sendStatus(204);
});

// ---------------------------------------------------------------------------
// Register all API routes
// ---------------------------------------------------------------------------
registerRoutes(app);

// ---------------------------------------------------------------------------
// 404 handler — for unknown API paths
// ---------------------------------------------------------------------------
app.use((_req: any, res: any) => {
  res.status(404).json({ error: "API route not found." });
});

// ---------------------------------------------------------------------------
// Global error handler — ensures Vercel never returns an HTML 500 page
// ---------------------------------------------------------------------------
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error("[API] Unhandled error:", err.name, err.message);
  res.status(500).json({
    error: "Internal server error.",
    message: process.env.NODE_ENV !== "production" ? err.message : undefined,
  });
});

export default app;
