import React from "react";
import "../css/Search.css";
import { FaSearch } from "react-icons/fa";

function Search({ setSearchQuery }) { // Destructure setSearchQuery from props
  const handleSearch = (e) => {
    setSearchQuery(e.target.value); // Use setSearchQuery directly
  };

  return (
    <div className="S_search-container">
      <FaSearch id="S_search-icon" />
      <input
        className="S_search-text"
        type="search"
        placeholder="Search..."
        name="searchQuery"
        onChange={handleSearch}
      />
    </div>
  );
}

export default Search;