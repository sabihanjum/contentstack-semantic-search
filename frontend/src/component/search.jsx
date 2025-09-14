import React, { useState } from "react";
import { searchContent } from "./api";

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    try {
      const data = await searchContent(query);
      setResults(data.matches || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", background: "#111", color: "#fff", minHeight: "100vh" }}>
      <h1>ContentStack Semantic Search</h1>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        style={{ padding: "0.5rem", marginRight: "0.5rem" }}
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? "Searching..." : "Search"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {results.map((item, idx) => (
          <li key={idx}>
            <strong>{item.metadata?.title}</strong> — {item.metadata?.description} (Score:{" "}
            {item.score?.toFixed(3)})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
