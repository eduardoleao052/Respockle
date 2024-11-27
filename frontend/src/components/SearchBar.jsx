import React, { useState } from 'react';

export default function SearchBar({ onSearch, onClick }) {
  const [query, setQuery] = useState("");

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <input
      type="text"
      placeholder="Search..."
      value={query}
      onChange={handleInputChange}
      onClick={onClick}
    />
  );
}