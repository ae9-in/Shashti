import express from "express";
import jwt from "jsonwebtoken";
import { prisma } from "./db";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const JWT_SECRET = process.env.JWT_SECRET || "shashti_secret_temp_key_12345";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

// Valid status values for applications
const VALID_STATUSES = ["PENDING", "CONTACTED", "REJECTED", "APPROVED"] as const;
type ApplicationStatus = (typeof VALID_STATUSES)[number];

// ---------------------------------------------------------------------------
// Middleware: JWT Authentication
// ---------------------------------------------------------------------------
export interface AuthenticatedRequest {
  user?: jwt.JwtPayload | string;
  [key: string]: any;
}

export function authenticateJWT(
  req: any,
  res: any,
  next: any
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Access denied. No token provided." });
    return;
  }

  const token = authHeader.slice(7); // Remove "Bearer " prefix

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: "Token has expired. Please log in again." });
    } else {
      res.status(401).json({ error: "Invalid token." });
    }
  }
}

// ---------------------------------------------------------------------------
// Route Registration
// ---------------------------------------------------------------------------
export function registerRoutes(app: ReturnType<typeof express>): void {
  // ── Ping (no DB, pure health check) ──────────────────────────────────────
  app.get("/api/ping", (_req: any, res: any) => {
    res.json({ ok: true, timestamp: new Date().toISOString() });
  });

  // ── DB Health Check ───────────────────────────────────────────────────────
  app.get("/api/health", async (_req: any, res: any) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.json({
        ok: true,
        db: "connected",
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown DB error";
      console.error("[Health] DB connection failed:", message);
      res.status(503).json({
        ok: false,
        db: "disconnected",
        error: message,
        timestamp: new Date().toISOString(),
      });
    }
  });

  // ── Admin Login ───────────────────────────────────────────────────────────
  // POST /api/admin/login
  // Body: { email: string, password: string }
  app.post("/api/admin/login", (req: any, res: any) => {
    try {
      const { email, password } = req.body ?? {};

      if (!email || !password) {
        res.status(400).json({ error: "Email and password are required." });
        return;
      }

      if (typeof email !== "string" || typeof password !== "string") {
        res.status(400).json({ error: "Invalid request format." });
        return;
      }

      if (email.trim() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const token = jwt.sign({ email: email.trim(), role: "admin" }, JWT_SECRET, {
          expiresIn: "24h",
        });
        res.json({ success: true, token });
        return;
      }

      res.status(401).json({ error: "Invalid email or password." });
    } catch (err) {
      console.error("[Admin Login] Unexpected error:", err);
      res.status(500).json({ error: "An unexpected error occurred during login." });
    }
  });

  // ── Submit Application ────────────────────────────────────────────────────
  // POST /api/apply
  // Body: { fullName, phone, email, city, state, pincode, categories, additionalInfo? }
  app.post("/api/apply", async (req: any, res: any) => {
    try {
      const {
        fullName,
        phone,
        email,
        city,
        state,
        pincode,
        categories,
        additionalInfo,
      } = req.body ?? {};

      // Validate required fields
      const missing: string[] = [];
      if (!fullName) missing.push("fullName");
      if (!phone) missing.push("phone");
      if (!email) missing.push("email");
      if (!city) missing.push("city");
      if (!state) missing.push("state");
      if (!pincode) missing.push("pincode");

      if (missing.length > 0) {
        res.status(400).json({
          error: "Missing required fields.",
          fields: missing,
        });
        return;
      }

      // Validate phone (10 digits)
      if (!/^\d{10}$/.test(String(phone).trim())) {
        res.status(400).json({ error: "Phone must be a 10-digit number." });
        return;
      }

      // Validate email format
      if (!/\S+@\S+\.\S+/.test(String(email).trim())) {
        res.status(400).json({ error: "Invalid email address." });
        return;
      }

      // Normalize categories
      const normalizedCategories: string[] = Array.isArray(categories)
        ? categories.filter((c: unknown) => typeof c === "string")
        : [];

      const application = await prisma.application.create({
        data: {
          fullName: String(fullName).trim(),
          phone: String(phone).trim(),
          email: String(email).trim().toLowerCase(),
          city: String(city).trim(),
          state: String(state).trim(),
          pincode: String(pincode).trim(),
          categories: normalizedCategories,
          additionalInfo: additionalInfo ? String(additionalInfo).trim() : null,
          status: "PENDING",
        },
      });

      res.status(201).json({ success: true, application });
    } catch (err) {
      console.error("[Apply] Error creating application:", err);
      const message = err instanceof Error ? err.message : "Unknown error";
      res.status(500).json({
        error: "Failed to submit application.",
        detail: process.env.NODE_ENV !== "production" ? message : undefined,
      });
    }
  });

  // ── List All Applications ─────────────────────────────────────────────────
  // GET /api/applications
  // Requires: Bearer token
  app.get(
    "/api/applications",
    authenticateJWT as any,
    async (_req: any, res: any) => {
      try {
        const applications = await prisma.application.findMany({
          orderBy: { createdAt: "desc" },
        });
        res.json({ success: true, count: applications.length, applications });
      } catch (err) {
        console.error("[Applications] Error fetching:", err);
        res.status(500).json({ error: "Failed to fetch applications." });
      }
    }
  );

  // ── Update Application Status ─────────────────────────────────────────────
  // PATCH /api/applications/:id
  // Body: { status: "PENDING" | "CONTACTED" | "REJECTED" | "APPROVED" }
  // Requires: Bearer token
  app.patch(
    "/api/applications/:id",
    authenticateJWT as any,
    async (req: any, res: any) => {
      try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id) || id <= 0) {
          res.status(400).json({ error: "Invalid application ID." });
          return;
        }

        const { status } = req.body ?? {};
        if (!status) {
          res.status(400).json({ error: "Status is required." });
          return;
        }

        if (!VALID_STATUSES.includes(status as ApplicationStatus)) {
          res.status(400).json({
            error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}.`,
          });
          return;
        }

        const application = await prisma.application.update({
          where: { id },
          data: { status: status as ApplicationStatus },
        });

        res.json({ success: true, application });
      } catch (err: unknown) {
        // Prisma "Record not found" error
        if (
          typeof err === "object" &&
          err !== null &&
          "code" in err &&
          (err as { code: string }).code === "P2025"
        ) {
          res.status(404).json({ error: "Application not found." });
          return;
        }
        console.error("[Applications] Error updating:", err);
        res.status(500).json({ error: "Failed to update application." });
      }
    }
  );

  // ── Delete Application ────────────────────────────────────────────────────
  // DELETE /api/applications/:id
  // Requires: Bearer token
  app.delete(
    "/api/applications/:id",
    authenticateJWT as any,
    async (req: any, res: any) => {
      try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id) || id <= 0) {
          res.status(400).json({ error: "Invalid application ID." });
          return;
        }

        await prisma.application.delete({ where: { id } });

        res.json({ success: true, message: "Application deleted." });
      } catch (err: unknown) {
        if (
          typeof err === "object" &&
          err !== null &&
          "code" in err &&
          (err as { code: string }).code === "P2025"
        ) {
          res.status(404).json({ error: "Application not found." });
          return;
        }
        console.error("[Applications] Error deleting:", err);
        res.status(500).json({ error: "Failed to delete application." });
      }
    }
  );
}
