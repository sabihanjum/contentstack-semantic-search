import express from "express";
import crypto from "crypto";
import { fetchEntryByUid } from "../services/contentstack.js";
// import { embedTexts } from "../services/embeddings.js";
import { generateEmbeddings } from "../services/openai.js";

// import { upsertVectors, deleteByFilter } from "../services/vector.js";
import { upsertVector } from "../services/pinecone.js";


const router = express.Router();

/**
 * Basic HMAC verify (Contentstack support sending signature)
 * Adjust header name if your webhook uses another header.
 */
function verifySignature(body, signature) {
  const secret = process.env.WEBHOOK_SECRET || "";
  if (!secret) return false;
  const h = crypto.createHmac("sha256", secret).update(body).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(h), Buffer.from(signature));
}

// Contentstack sends JSON; we need raw body to verify HMAC. Express.json consumes body,
// so in production consider using express.raw for that endpoint. For simplicity, we trust here.
router.post("/contentstack", express.json(), async (req, res) => {
  try {
    // optional: verify signature header
    const sig = req.get("x-cs-webhook-signature") || req.get("X-CS-Webhook-Signature") || "";
    // NOTE: if you want proper raw verification, switch to express.raw for this route.
    if (process.env.WEBHOOK_SECRET && sig) {
      // if signature present, we skip verification here; advanced implementations use raw body
      // For now proceed (or implement raw body verification if needed)
    }

    const evt = req.body;
    // Contentstack payload shapes vary. Common fields: event, data.entry.uid, data.content_type.uid, locale
    const eventType = evt.event || evt.type || "";
    // Extract values robustly
    const entryUid = evt?.data?.entry?.uid || evt?.data?.uid || evt?.data?.entry_uid;
    const ct = evt?.data?.content_type?.uid || evt?.data?.content_type;
    const locale = evt?.data?.locale || process.env.CONTENTSTACK_ENVIRONMENT;

    if (!entryUid || !ct) {
      return res.status(400).json({ error: "no entry uid or contentType in webhook payload" });
    }

    if (eventType && eventType.toLowerCase().includes("delete")) {
      // delete vectors related to this entry
      await deleteByFilter({ entryUid: { $eq: entryUid } });
      return res.json({ ok: true, action: "deleted" });
    }

    // create/update -> fetch entry, embed, upsert
    const entry = await fetchEntryByUid(ct, entryUid, locale);
    const text = `${entry.title || ""}\n\n${entry.short_description || entry.description || ""}`.replace(/\s+/g, " ");
    const [vector] = await embedTexts([text]);
    const id = `${entryUid}:${ct}:${locale}`;
    await upsertVectors([{ id, values: vector, metadata: { entryUid, contentType: ct, locale, title: entry.title || "" } }]);

    res.json({ ok: true });
  } catch (err) {
    console.error("webhook error:", err);
    res.status(500).json({ error: String(err?.message || err) });
  }
});

export default router;
