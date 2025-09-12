import pkg from "@pinecone-database/pinecone";
import dotenv from "dotenv";

dotenv.config();

const { Pinecone } = pkg;

// ✅ Create Pinecone client
const client = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

/**
 * Ensure the index exists (run once at startup)
 */
async function initPinecone() {
  const indexName = process.env.PINECONE_INDEX || "semantic-search";

  // Get list of indexes
  const existingIndexes = await client.listIndexes();

  if (!existingIndexes.indexes.find((idx) => idx.name === indexName)) {
    console.log(`🆕 Creating Pinecone index: ${indexName}`);
    await client.createIndex({
      name: indexName,
      dimension: 768, // 👈 matches OpenAI embeddings
      metric: "cosine",
    });
    console.log("✅ Index created!");
  } else {
    console.log(`ℹ️ Using existing Pinecone index: ${indexName}`);
  }

  return client.Index(indexName);
}

// ✅ Initialize index
export const index = await initPinecone();

/**
 * Batch upsert vectors
 */
export async function upsertVectors(vectors, namespace = "default") {
  if (!Array.isArray(vectors)) {
    throw new Error("upsertVectors expects an array of vectors");
  }

  return await index.upsert(vectors, { namespace });
}

/**
 * Query vectors
 */
export async function searchVector(vector, topK = 5, namespace = "default") {
  return await index.query({
    vector,
    topK,
    includeMetadata: true,
  },
   { namespace}
  );
}
