// routes/indexer.js
import express from "express";
import { fetchEntries } from "../services/contentstack.js";
import { generateEmbeddings } from "../services/openai.js";
import { upsertVectors } from "../services/pinecone.js"; // ✅ correct import

const router = express.Router();

// POST /index/:type → index entries of a content type
router.post("/:type", async (req, res) => {
  try {
    const { type } = req.params;
    console.log(`Indexing content type: ${type}`);

    // Fetch entries from Contentstack
    const entries = await fetchEntries(type);

    if (!entries || entries.length === 0) {
      return res.status(404).json({ error: "No entries found" });
    }

    // Generate embeddings for each entry
    const vectors = await Promise.all(
      entries.map(async (entry) => {
        const text = `${entry.title || ""} ${entry.description || ""}`;
        const embedding = await generateEmbeddings(text);

        return {
          id: entry.uid, // unique identifier for Pinecone
          values: embedding, // numeric vector
          metadata: {
            title: entry.title,
            description: entry.description,
          },
        };
      })
    );

    // Debug log: show what’s being sent to Pinecone
    console.log("Vectors to upsert:", JSON.stringify(vectors, null, 2));

    // Save embeddings into Pinecone, under namespace = type
    await upsertVectors(vectors, type);

    res.json({ success: true, count: vectors.length });
  } catch (err) {
    console.error("Indexing error:", err);
    res.status(500).json({ error: "Indexing failed", details: err.message });
  }
});

export default router;
