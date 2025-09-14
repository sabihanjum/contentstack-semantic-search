import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ✅ Allow local dev, deployed frontend, and Contentstack
const allowedOrigins = [
  "http://localhost:3000",
  "https://contentstack-semantic-search-frontend.onrender.com", // 🔥 no trailing slash
  "https://app.contentstack.com"
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200); // ✅ handles preflight
  }
  next();
});

app.use(express.json({ limit: "5mb" }));

// Health check
app.get("/health", (_req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || "dev" });
});

// Routes
import contentRoutes from "./routes/content.js";
import searchRoutes from "./routes/search.js";
import indexerRoutes from "./routes/indexer.js";
import webhookRoutes from "./routes/webhook.js";

app.use("/content", contentRoutes);
app.use("/search", searchRoutes);
app.use("/index", indexerRoutes);
app.use("/webhooks", webhookRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
