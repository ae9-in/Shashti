import express from "express";
import { createServer } from "http";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { registerRoutes } from "./routes";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();

  // Parse JSON and URL-encoded bodies
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Register Express API routes
  registerRoutes(app);

  const isProduction = process.env.NODE_ENV === "production";
  
  if (!isProduction) {
    // In development: run Vite in middleware mode
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
    
    app.use(vite.middlewares);
    
    // Serve client index.html parsed through Vite
    app.use("*", async (req, res, next) => {
      const url = req.originalUrl;
      try {
        const clientIndexPath = path.resolve(__dirname, "..", "client", "index.html");
        let template = fs.readFileSync(clientIndexPath, "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    // In production: serve built static files from dist
    const staticPath = __dirname;
    app.use(express.static(staticPath));
    
    app.get("*", (_req, res) => {
      res.sendFile(path.join(staticPath, "index.html"));
    });
  }

  const server = createServer(app);
  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
