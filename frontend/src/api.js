const API_URL = import.meta.env.VITE_API_URL;

export async function searchContent(query) {
  const res = await fetch(`${API_URL}/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch search results");
  }

  return res.json();
}
