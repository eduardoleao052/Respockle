import React, { useState } from 'react';
import "../index.css"

export default function CommunitySearchbar({ onSearch, onClick }) {
  const [query, setQuery] = useState("");

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <input
      id="community_searchbar"
      type="text"
      placeholder="Search..."
      value={query}
      onChange={handleInputChange}
      onClick={onClick}
      autoComplete="off"
    />
  );
}