import express from "express";
import { generateEmbeddings } from "../services/openai.js";
import { searchVector } from "../services/pinecone.js";

const router = express.Router();

// POST /search
router.post("/", async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    // ✅ Generate embeddings
    const vector = await generateEmbeddings(query);

    // ✅ Search Pinecone (reuse helper)
    const searchResponse = await searchVector(vector, 5, "product"); 
    // you can change "product" → "tour" or dynamic namespace later

    res.json(searchResponse);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Search failed" });
  }
});

export default router;
