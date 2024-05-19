import { Express } from "express";
import { respondWith } from "utils/responseHandling";

// AWS health checking endpoint
export const useHealthReport = (app: Express) => {
  app.get("/api/health", (req, res) => {
    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Surrogate-Control", "no-store");

    respondWith({ res, status: 200, data: "OK" });
  });
};
