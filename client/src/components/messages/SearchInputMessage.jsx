import React, { useEffect, useState } from "react";
import { IoCloseCircleSharp } from "react-icons/io5";

const SearchInputMessage = ({
  handleSearchMessage,
  search,
  setSearch,
  setIsSearchActive,
}) => {
  useEffect(() => {
    let timeout = null;

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      handleSearchMessage();
    }, 200);

    return () => {
      clearTimeout(timeout);
    };
  }, [search]);

  const handleSearchFunctionality = (e) => {
    setSearch(e.target.value);
  };

  return (
    <div className="fixed top-12 right-3 z-10 flex">
      <input
        type="text"
        placeholder="Search within chat..."
        className="input input-bordered rounded-full w-full"
        value={search}
        onChange={handleSearchFunctionality}
      />
      <button
        type="button"
        className="btn btn-circle bg-yellow-500 text-white absolute right-0 rounded-l-sm"
        onClick={() => setIsSearchActive(false)}
      >
        <IoCloseCircleSharp className="w-6 h-6 outline-none" />
      </button>
    </div>
  );
};

export default SearchInputMessage;
