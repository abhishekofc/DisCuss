import React from "react";

const Pagination = ({ page, totalPages, setPage }) => {
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 6) {
      // Show all pages if there are 6 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (page > 3) pages.push("...");

      // Show middle pages
      let start = Math.max(2, page - 1);
      let end = Math.min(totalPages - 1, page + 1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (page < totalPages - 2) pages.push("...");

      // Always show last page
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center space-x-2 bg-black p-2 rounded-lg shadow-lg">
      <button
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
        className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
      >
        Prev
      </button>

      {getPageNumbers().map((num, index) =>
        num === "..." ? (
          <span key={index} className="px-3 text-gray-400">
            ...
          </span>
        ) : (
          <button
            key={num}
            onClick={() => setPage(num)}
            className={`px-3 py-1 rounded-lg ${
              num === page
                ? "bg-blue-500 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            {num}
          </button>
        )
      )}

      <button
        onClick={() => setPage(page + 1)}
        disabled={page === totalPages}
        className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
