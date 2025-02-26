import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Since this is primarily a client-side app, we'll keep the backend minimal
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  const httpServer = createServer(app);
  return httpServer;
}
