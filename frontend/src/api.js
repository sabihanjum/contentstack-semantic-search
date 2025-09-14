const API_URL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://contentstack-semantic-search-backend.onrender.com"
    : "http://localhost:5000");

export async function searchContent(query) {
  const res = await fetch(`${API_URL}/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed: ${res.status} ${errorText}`);
  }

  return res.json();
}
