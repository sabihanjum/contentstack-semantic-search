import express from "express";
import { fetchEntries } from "../services/contentstack.js";
import { generateEmbeddings } from "../services/openai.js";
import { index } from "../services/pinecone.js";

const router = express.Router();

router.post("/:type", async (req, res) => {
  try {
    const { type } = req.params;
    console.log(`Indexing content type: ${type}`);

    const entries = await fetchEntries(type);

    if (!entries || entries.length === 0) {
      return res.status(404).json({ error: "No entries found" });
    }

    const vectors = await Promise.all(
      entries.map(async (entry) => {
        const text = `${entry.title || ""} ${entry.description || ""}`;
        const embedding = await generateEmbeddings(text);

        return {
          id: entry.uid,
          values: embedding,
          metadata: {
            title: entry.title,
            description: entry.description,
          },
        };
      })
    );

    await index.upsert({
      vectors,
      namespace: type,
    });

    res.json({ success: true, count: vectors.length });
  } catch (err) {
    console.error("Indexing error:", err);
    res.status(500).json({ error: "Indexing failed", details: err.message });
  }
});

// Debug only: fetch all products once when server starts
if (process.env.NODE_ENV === "dev") {
  (async () => {
    try {
      const testEntries = await fetchEntries("product");
      console.log("Fetched entries count:", testEntries.length);

      if (testEntries.length > 0) {
        const firstEntry = testEntries[0];
        console.log("First entry title:", firstEntry.title);
      }
    } catch (err) {
      console.error("Test fetchEntries failed:", err.message);
    }
  })();
}


export default router;