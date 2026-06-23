import { Express } from "express";
import { prisma } from "./db";

export function registerRoutes(app: Express) {
  // Submit a new application
  app.post("/api/apply", async (req, res) => {
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
  app.get("/api/applications", async (_req, res) => {
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
  app.patch("/api/applications/:id", async (req, res) => {
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
  app.delete("/api/applications/:id", async (req, res) => {
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
