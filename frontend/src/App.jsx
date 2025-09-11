import React, { useState } from "react";
import { searchContent } from "./api";

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) return;
    try {
      setError("");
      const data = await searchContent(query);
      setResults(data.results || []);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#121212",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "3rem 1rem",
      }}
    >
      <h1 style={{ fontSize: "3rem", fontWeight: "bold", marginBottom: "2rem" }}>
        ContentStack Semantic Search
      </h1>

      <div style={{ display: "flex", marginBottom: "2rem" }}>
        <input
          type="text"
          placeholder="🔍 Enter search query..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "8px 0 0 8px",
            border: "1px solid #444",
            outline: "none",
            width: "300px",
            fontSize: "1rem",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "0.75rem 1.5rem",
            background: "linear-gradient(90deg, #1DB954, #1ED760)",
            color: "#fff",
            border: "none",
            borderRadius: "0 8px 8px 0",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "1rem",
            transition: "0.3s",
          }}
          onMouseOver={(e) => (e.target.style.opacity = "0.9")}
          onMouseOut={(e) => (e.target.style.opacity = "1")}
        >
          Search
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1rem",
          width: "100%",
          maxWidth: "900px",
        }}
      >
        {results.map((item, idx) => (
          <div
            key={idx}
            style={{
              background: "#1e1e1e",
              padding: "1.2rem",
              borderRadius: "12px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
            }}
          >
            <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>
              {item.title || "Untitled"}
            </h3>
            <p style={{ fontSize: "0.95rem", color: "#aaa" }}>
              {item.description || JSON.stringify(item)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
