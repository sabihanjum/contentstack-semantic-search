import { useState } from "react";

function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setResults(data.matches || []);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">ContentStack Semantic Search</h1>

      <div className="flex">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="px-4 py-2 rounded-l bg-gray-800 text-white w-80"
        />
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-green-500 rounded-r text-black font-bold"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      <div className="mt-8 w-full max-w-xl space-y-4">
        {results.map((item) => (
          <div key={item.id} className="p-4 bg-gray-900 rounded-lg">
            <h2 className="text-xl font-semibold">{item.metadata?.title}</h2>
            <p className="text-gray-400">{item.metadata?.description}</p>
            <span className="text-sm text-gray-500">
              Score: {item.score.toFixed(3)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Search;
