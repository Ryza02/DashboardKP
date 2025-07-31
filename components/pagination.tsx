import { useState, useEffect } from "react";

export default function Pagination({
  page,
  setPage,
  pageCount
}: {
  page: number;
  setPage: (p: number) => void;
  pageCount: number;
}) {
  // Logic tampil 1 ... 5 6 7 ... 300 jika page banyak
  const [inputPage, setInputPage] = useState("");

  // Helper untuk range
  function getPages() {
    const delta = 2;
    const pages: (number | string)[] = [];
    let l: number;

    for (let i = 1; i <= pageCount; i++) {
      if (
        i === 1 ||
        i === pageCount ||
        (i >= page - delta && i <= page + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  }

  return (
    <div className="flex flex-col gap-2 items-end mt-4">
      <div className="flex gap-1 flex-wrap">
        {getPages().map((p, i) =>
          typeof p === "number" ? (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1 rounded-lg text-sm font-medium ${
                page === p
                  ? "bg-purple-600 text-white"
                  : "bg-white/20 text-white hover:bg-purple-600/60"
              }`}
            >
              {p}
            </button>
          ) : (
            <span key={"dots-" + i} className="px-2 text-gray-400 select-none">
              ...
            </span>
          )
        )}
      </div>
      {/* Search input bawah pagination */}
      <form
        onSubmit={e => {
          e.preventDefault();
          let pageNum = parseInt(inputPage);
          if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= pageCount) {
            setPage(pageNum);
            setInputPage("");
          }
        }}
        className="flex items-center gap-2 mt-2"
      >
        <label className="text-xs text-white/70">Go to page</label>
        <input
          type="number"
          min={1}
          max={pageCount}
          value={inputPage}
          onChange={e => setInputPage(e.target.value)}
          className="w-20 px-2 py-1 rounded-lg text-sm bg-gray-900/60 text-white border border-gray-600"
        />
        <button
          type="submit"
          className="px-3 py-1 bg-purple-600 rounded-lg text-white text-sm font-semibold hover:bg-purple-800"
        >
          Cari
        </button>
      </form>
    </div>
  );
}
