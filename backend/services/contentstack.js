import contentstack from "contentstack";
import dotenv from "dotenv";

dotenv.config();

// ✅ Initialize Contentstack Stack
const Stack = contentstack.Stack({
  api_key: process.env.CONTENTSTACK_API_KEY,
  delivery_token: process.env.CONTENTSTACK_DELIVERY_TOKEN,
  environment: process.env.CONTENTSTACK_ENVIRONMENT,
  region: contentstack.Region.EU,   // ✅ Your stack is in EU region
  host: process.env.CONTENTSTACK_API_HOST || "preview.contentstack.io" // ✅ Use Preview API
});

// ✅ Fetch all entries of a content type
export async function fetchEntries(contentType) {
  return new Promise((resolve, reject) => {
    const Query = Stack.ContentType(contentType).Query();

    Query
      .toJSON()
      .find()
      .then((result) => {
        resolve(result[0] || []); // ✅ return entries array
      })
      .catch((err) => reject(new Error("Contentstack fetch failed: " + err.message)));
  });
}

// ✅ Fetch a single entry by UID
export async function fetchEntryByUid(contentType, uid) {
  return new Promise((resolve, reject) => {
    Stack.ContentType(contentType)
      .Entry(uid)
      .toJSON()
      .fetch()
      .then((entry) => resolve(entry))
      .catch((err) => reject(new Error("Contentstack fetch by UID failed: " + err.message)));
  });
}
