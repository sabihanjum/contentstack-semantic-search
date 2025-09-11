import express from "express";
import { generateEmbeddings } from "../services/openai.js";
import { getPineconeClient } from "../services/pinecone.js";

const router = express.Router();

// POST /search
router.post("/", async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    // ✅ Generate embeddings using Gemini
    const vector = await generateEmbeddings(query);

    // ✅ Search Pinecone
    const client = getPineconeClient();
    const index = client.Index(process.env.PINECONE_INDEX);

    const searchResponse = await index.query({
      vector,
      topK: 5,
      includeMetadata: true,
    });

    res.json(searchResponse);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Search failed" });
  }
});

export default router;
