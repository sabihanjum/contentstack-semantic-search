import pkg from "@pinecone-database/pinecone";
import dotenv from "dotenv";

dotenv.config();

const { Pinecone } = pkg;

// Create client
const client = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

// Export helper
export function getPineconeClient() {
  return client;
}

// Export index (shortcut)
export const index = client.Index(process.env.PINECONE_INDEX);

// Utility functions
export async function upsertVector(id, vector, metadata = {}) {
  return await index.upsert([
    {
      id,
      values: vector,
      metadata,
    },
  ]);
}

export async function searchVector(vector, topK = 5) {
  return await index.query({
    vector,
    topK,
    includeMetadata: true,
  });
}
