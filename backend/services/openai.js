import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateEmbeddings(text) {
  const model = genAI.getGenerativeModel({ model: "embedding-001" });

  const result = await model.embedContent(text);
  return result.embedding.values;
}
// services/openai.js
// import OpenAI from "openai";
// import dotenv from "dotenv";
// dotenv.config();   // ensure env loads here

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// export async function generateEmbeddings(text) {
//   const response = await openai.embeddings.create({
//     model: "text-embedding-3-small",
//     input: text,
//   });
//   return response.data[0].embedding;
// }

