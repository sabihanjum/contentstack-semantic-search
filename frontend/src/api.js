const API_URL = "https://contentstack-semantic-search-backend.onrender.com";

export async function searchContent(query) {
  const res = await fetch(`${API_URL}/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch search results");
  }

  return res.json();
}
