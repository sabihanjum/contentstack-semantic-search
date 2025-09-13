import express from "express";
import { generateEmbeddings } from "../services/openai.js";
import { upsertVectors } from "../services/pinecone.js";

const router = express.Router();

// Contentstack Webhook
router.post("/contentstack", async (req, res) => {
  try {
    const secret = req.headers["x-webhook-secret"];
    if (secret !== process.env.WEBHOOK_SECRET) {
      return res.status(403).json({ error: "Invalid secret" });
    }

    const { data, event } = req.body;

    // Example: Entry Created / Updated
    if (event === "entry.create" || event === "entry.update") {
      const entry = data.entry;
      const text = `${entry.title || ""} ${entry.description || ""}`;
      const embedding = await generateEmbeddings(text);

      const vector = {
        id: entry.uid,
        values: embedding,
        metadata: {
          title: entry.title,
          description: entry.description,
        },
      };

      await upsertVectors([vector], entry.content_type_uid);
    }

    // Example: Entry Deleted
    if (event === "entry.delete") {
      await index.deleteOne(data.entry.uid); 
      // You could delete from Pinecone using entry.uid
      console.log(`Delete vector for entry: ${data.entry.uid}`);
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).json({ error: "Webhook handling failed" });
  }
});

export default router;
