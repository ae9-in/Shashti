import express, { NextFunction, Request, Response } from "express";
import { registerRoutes } from "../server/routes";

const app = express();

// Parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register all Express API routes
registerRoutes(app);

// Global JSON error handler — ensures Vercel never returns an HTML error page
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[API Error]", err);
  res.status(500).json({ error: "Internal server error", message: err.message });
});

export default app;
