import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import contentRoutes from "./routes/content.js";
import searchRoutes from "./routes/search.js";
import indexerRoutes from "./routes/indexer.js";
import webhookRoutes from "./routes/webhook.js";



const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" })); // allow JSON bodies (webhook will be validated separately)

// health
app.get("/health", (_req, res) => res.json({ ok: true, env: process.env.NODE_ENV || "dev" }));

// routes
app.use("/content", contentRoutes);
app.use("/search", searchRoutes);
app.use("/index", indexerRoutes);
app.use("/webhooks", webhookRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

