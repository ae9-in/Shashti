import { Express, Request, Response, NextFunction } from "express";
import { prisma } from "./db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "shashti_secret_temp_key_12345";

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export function authenticateJWT(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Access denied. Invalid token format." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
}

export function registerRoutes(app: Express) {
  // Admin Login route
  app.post("/api/admin/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      if (email === "admin@gmail.com" && password === "admin123") {
        const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "24h" });
        return res.json({ success: true, token });
      }

      return res.status(401).json({ error: "Invalid email or password" });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ error: "An unexpected error occurred during login" });
    }
  });

  // Submit a new application
  app.post("/api/apply", async (req: Request, res: Response) => {
    try {
      const { fullName, phone, email, city, state, pincode, categories, additionalInfo } = req.body;

      if (!fullName || !phone || !email || !city || !state || !pincode) {
        return res.status(400).json({ error: "All required fields must be provided" });
      }

      const application = await prisma.application.create({
        data: {
          fullName,
          phone,
          email,
          city,
          state,
          pincode,
          categories: Array.isArray(categories) ? categories : [],
          additionalInfo: additionalInfo || null,
          status: "PENDING",
        },
      });

      return res.status(201).json({ success: true, application });
    } catch (error) {
      console.error("Error creating application:", error);
      return res.status(500).json({ error: "Failed to submit application" });
    }
  });

  // Get all applications (ordered by newest first)
  app.get("/api/applications", authenticateJWT as any, async (_req: Request, res: Response) => {
    try {
      const applications = await prisma.application.findMany({
        orderBy: { createdAt: "desc" },
      });
      return res.json(applications);
    } catch (error) {
      console.error("Error fetching applications:", error);
      return res.status(500).json({ error: "Failed to fetch applications" });
    }
  });

  // Update application status (PENDING, APPROVED, REJECTED, CONTACTED)
  app.patch("/api/applications/:id", authenticateJWT as any, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;

      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid application ID" });
      }

      if (!status) {
        return res.status(400).json({ error: "Status must be provided" });
      }

      const application = await prisma.application.update({
        where: { id },
        data: { status },
      });

      return res.json({ success: true, application });
    } catch (error) {
      console.error("Error updating application:", error);
      return res.status(500).json({ error: "Failed to update application" });
    }
  });

  // Delete an application
  app.delete("/api/applications/:id", authenticateJWT as any, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid application ID" });
      }

      await prisma.application.delete({
        where: { id },
      });

      return res.json({ success: true });
    } catch (error) {
      console.error("Error deleting application:", error);
      return res.status(500).json({ error: "Failed to delete application" });
    }
  });
}

