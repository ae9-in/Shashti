import express from "express";
import { registerRoutes } from "../server/routes";

const app = express();

// Parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register all Express API routes
registerRoutes(app);

export default app;
