'use client';

import { useEffect, useState } from 'react';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Debounce logic: wait 1s after user stops typing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 1000);

    return () => clearTimeout(handler);
  }, [query]);

  // Fetch results when debouncedQuery changes
  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://openlibrary.org/search.json?q=${debouncedQuery}`
        );
        const data = await res.json();
        setResults(data.docs.slice(0, 10)); // show top 10
      } catch (err) {
        console.error('Search failed', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">📚 Book Search</h1>
      <input
        type="text"
        className="w-full max-w-md p-3 rounded border border-gray-300 text-gray-700 focus:outline-none focus:ring focus:border-blue-400"
        placeholder="Search books..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {loading && <p className="mt-4 text-gray-500">Searching...</p>}

      {results.length > 0 && (
        <ul className="w-full max-w-md bg-white mt-4 rounded shadow border border-gray-200 max-h-80 overflow-auto">
          {results.map((book, index) => (
            <li
              key={index}
              className="p-3 border-b hover:bg-gray-100 text-gray-900 transition"
            >
              <strong>{book.title}</strong>
              {book.author_name && (
                <p className="text-sm text-gray-600">by {book.author_name.join(', ')}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
