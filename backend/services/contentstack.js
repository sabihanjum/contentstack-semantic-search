// services/contentstack.js
import contentstack from "contentstack";
import dotenv from "dotenv";
dotenv.config();

const Stack = contentstack.Stack({
  api_key: process.env.CONTENTSTACK_API_KEY,
  delivery_token: process.env.CONTENTSTACK_DELIVERY_TOKEN,
  environment: process.env.CONTENTSTACK_ENVIRONMENT,
});

// Fetch all entries of a content type
export async function fetchEntries(contentType) {
  return new Promise((resolve, reject) => {
    Stack.ContentType(contentType)
      .Query()
      .toJSON()   // <-- must come before .find()
      .find()
      .then(
        (result) => {
          const entries = result[0] || [];
          resolve(entries);
        },
        (error) => reject(error)
      );
  });
}

// Fetch a single entry by UID
export async function fetchEntryByUid(contentType, uid) {
  return new Promise((resolve, reject) => {
    Stack.ContentType(contentType)
      .Entry(uid)
      .toJSON()   // <-- must come before .fetch()
      .fetch()
      .then(resolve, reject);
  });
}
