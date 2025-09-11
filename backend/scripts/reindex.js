// lightweight CLI reindex script
import("./index.js").then(() => {}).catch(() => {}); // ensure environment loads if needed

import fetch from "node-fetch"; // optional; using fetch to call our local API
// We will call our local endpoint /index/full
(async () => {
  const base = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
  const url = `${base}/index/full`;
  console.log("Calling reindex:", url);
  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contentTypes: (process.env.REINDEX_TYPES || "product,tour").split(","), locales: [process.env.CONTENTSTACK_ENVIRONMENT || "en-us"], batchSize: 50 })
  });
  const data = await resp.json();
  console.log("reindex response:", data);
})();
