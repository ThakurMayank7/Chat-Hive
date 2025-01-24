"use client";

import { searchQuery } from "@/actions/actions";
import React, { useState } from "react";
import { MdOutlinePersonSearch } from "react-icons/md";

function Search({
  setSearchResults,
}: {
  setSearchResults: (results: string[]) => void;
}) {
  const [query, setQuery] = useState<string>("");

  const handleQueryChanges = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    if (newQuery && newQuery.length > 0) {
      await searchQuery(newQuery)
        .then((results: string[]) => {
          setSearchResults(results);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  return (
    <div className="flex flex-row items-center justify-center my-2 gap-2">
      <MdOutlinePersonSearch size={24} />
      <input
        className="bg-gray-200 rounded border-2 border-gray-400 text-sm p-1"
        type="search"
        value={query}
        onChange={handleQueryChanges}
        placeholder="Search for someone..."
      />
    </div>
  );
}

export default Search;
