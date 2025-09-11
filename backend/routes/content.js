import express from "express";
import { fetchEntries } from "../services/contentstack.js";

const router = express.Router();

/**
 * GET /content/:contentType
 * optional query: ?locale=en-us&skip=0&limit=50
 */
router.get("/:contentType", async (req, res) => {
  try {
    const { contentType } = req.params;
    const locale = req.query.locale;
    const skip = Number(req.query.skip || 0);
    const limit = Number(req.query.limit || 50);
    const entries = await fetchEntries(contentType, locale, skip, limit);
    res.json({ count: entries.length, items: entries });
  } catch (err) {
    res.status(500).json({ error: String(err?.message || err) });
  }
});

export default router;
