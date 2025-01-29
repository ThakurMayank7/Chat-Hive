"use client";

import { ChatData } from "@/lib/types";
import React, { useEffect, useRef, useState } from "react";
import { MdOutlinePersonSearch } from "react-icons/md";

function Search({
  setSearchResults,
  setSearching,
  chatData,
}: {
  setSearchResults: (results: string[]) => void;
  setSearching: (searching: boolean) => void;
  userId: string;
  chatData: ChatData[];
}) {
  const [query, setQuery] = useState<string>("");
  const setSearchingRef = useRef(setSearching);
  useEffect(() => {
    setSearchingRef.current = setSearching;
  }, [setSearching]);
  useEffect(() => {
    if (query.length > 0) {
      setSearchingRef.current(true);
    } else {
      setSearchingRef.current(false);
    }
  }, [query]);

  const handleQueryChanges = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery); // Update state
    if (newQuery && newQuery.length > 0) {
      try {
        const modifiedQuery = newQuery.toLowerCase().split(" ").join("");
        const results: string[] = [];

        for (const chatDataIterated of chatData) {
          if (
            chatDataIterated.personData.data.name
              .toLowerCase()
              .split(" ")
              .join("")
              .includes(modifiedQuery) ||
            chatDataIterated.personData.data.email
              .toLowerCase()
              .split(" ")
              .join("")
              .includes(modifiedQuery) ||
            chatDataIterated.personData.userId
              .toLowerCase()
              .split(" ")
              .join("")
              .includes(modifiedQuery)
          ) {
            results.push(chatDataIterated.metadata.chatId);
          }
        }

        console.log(results);
        setSearchResults(results);
      } catch (err) {
        console.error(err);
      }
    } else {
      setSearchResults([]);
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
