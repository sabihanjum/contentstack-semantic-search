import React, { useState } from "react";
import { searchContent } from "./api";

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    try {
      setLoading(true);
      setError("");
      const data = await searchContent(query);
      setResults(data.matches || []);
    } catch (err) {
      setError(err.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f0f0f, #1a1a1a)",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "3rem 1rem",
      }}
    >
      {/* Title */}
      <h1
        style={{
          fontSize: "3.5rem",
          fontWeight: "900",
          marginBottom: "2rem",
          background: "linear-gradient(90deg, #078f98ff, #1ED760)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        ContentStack Semantic Search
      </h1>

      {/* Search Bar */}
      <div
        style={{
          display: "flex",
          width: "100%",
          maxWidth: "600px",
          borderRadius: "12px",
          overflow: "hidden",
          marginBottom: "2.5rem",
          boxShadow: "0 4px 20px rgba(54, 179, 210, 0.4)",
        }}
      >
        <input
          type="text"
          placeholder="🔍 Search for products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            flex: 1,
            padding: "1rem",
            border: "none",
            outline: "none",
            fontSize: "1.1rem",
            color: "#fff",
            backgroundColor: "#222",
          }}
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          style={{
            padding: "1rem 2rem",
            background: "linear-gradient(90deg, #29b6adff, #1ED760)",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "1.1rem",
            transition: "0.3s",
          }}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Results Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1.5rem",
          width: "100%",
          maxWidth: "1000px",
        }}
      >
        {results.map((item, idx) => (
          <div
            key={idx}
            style={{
              background: "#1e1e1e",
              borderRadius: "15px",
              padding: "1.5rem",
              boxShadow: "0 8px 20px rgba(0,0,0,0.6)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.8)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.6)";
            }}
          >
            <h3 style={{ fontSize: "1.4rem", marginBottom: "0.5rem" }}>
              {item.metadata?.title || "Untitled"}
            </h3>
            <p style={{ fontSize: "1rem", color: "#bbb", marginBottom: "0.8rem" }}>
              {item.metadata?.description || "No description"}
            </p>
            <span
              style={{
                fontSize: "0.85rem",
                color: "#21dae0ff",
                fontWeight: "bold",
              }}
            >
              Score: {item.score?.toFixed(3)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
