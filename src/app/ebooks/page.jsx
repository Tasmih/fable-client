"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getEbooks } from "@/lib/actions/ebooks";

export default function BrowseEbooksPage() {
  const [ebooks, setEbooks] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("all");
  const [availability, setAvailability] = useState("all");
  const [sort, setSort] = useState("newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getUserEmail = () => {
    if (typeof window === "undefined") return "";

    try {
      const savedUser = localStorage.getItem("user");

      if (savedUser) {
        const user = JSON.parse(savedUser);
        return user?.email || "";
      }

      return localStorage.getItem("email") || "";
    } catch {
      return "";
    }
  };

 const fetchEbooks = async () => {
  try {
    setLoading(true);
    setError("");

    const email = getUserEmail();

    const data = await getEbooks({
      page,
      limit: 12,
      search,
      genre,
      availability,
      sort,
      minPrice,
      maxPrice,
      email,
    });

    setEbooks(data.ebooks || []);
    setPages(data.pages || 0);
    setTotal(data.total || 0);
  } catch (err) {
    setError(err.message || "Something went wrong");
    setEbooks([]);
    setPages(0);
    setTotal(0);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchEbooks();
  }, [search, genre, availability, sort, minPrice, maxPrice, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchText);
  };

  const handleClearFilter = () => {
    setSearchText("");
    setSearch("");
    setGenre("all");
    setAvailability("all");
    setSort("newest");
    setMinPrice("");
    setMaxPrice("");
    setPage(1);
  };

  const genres = [
    "Fiction",
    "Mystery",
    "Romance",
    "Sci-Fi",
    "Fantasy",
    "Horror",
    "Biography",
    "History",
    "Education",
    "Self-Help",
    "Technology",
    "Poetry",
    "Thriller",
  ];

  const inputClass =
    "w-full rounded-xl border border-[#053c41]/20 bg-white px-3 py-2.5 text-sm text-[#053c41] placeholder:text-[#053c41]/40 outline-none transition focus:border-[#AE7C54] focus:ring-2 focus:ring-[#AE7C54]/30";

  const labelClass = "mb-1 block text-sm font-semibold text-[#053c41]";

  return (
    <main className="min-h-screen bg-[#f6f1ea] px-4 py-8 md:px-8">
      <section className="mx-auto max-w-7xl">

        {/* page header */}
        <div className="mb-8 overflow-hidden rounded-3xl bg-[#053c41] px-6 py-8 text-white shadow-lg md:px-10 md:py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            {/* left text */}
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-[#AE7C54]">
                fable ebook library
              </p>

              <h1 className="text-3xl font-bold leading-tight md:text-5xl">
                Browse Original Ebooks
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#f6f1ea] md:text-base">
                Search, filter, and discover original ebooks from talented writers.
              </p>
            </div>

            {/* right button */}
            <div className="flex flex-col gap-3 sm:flex-row md:self-center">
  <Link
    href="#ebooks-list"
    className="shrink-0 rounded-xl bg-[#AE7C54] px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#c99367]"
  >
    Explore Books
  </Link>

  <Link
    href="/"
    className="shrink-0 rounded-xl border border-[#f6f1ea]/30 bg-white/10 px-6 py-3 text-center text-sm font-semibold text-[#f6f1ea] transition hover:bg-[#f6f1ea] hover:text-[#053c41]"
  >
    Back to Home
  </Link>
</div>
          </div>
        </div>

        {/* filter card */}
        <div className="mb-6 rounded-2xl border border-[#053c41]/10 bg-white p-3 shadow-sm md:p-4">
          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-6"
          >
            <div className="xl:col-span-2">
              <label className={labelClass}>Search</label>

              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search by title or writer"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Genre</label>

              <select
                value={genre}
                onChange={(e) => {
                  setGenre(e.target.value);
                  setPage(1);
                }}
                className={inputClass}
              >
                <option value="all">All genres</option>
                {genres.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Availability</label>

              <select
                value={availability}
                onChange={(e) => {
                  setAvailability(e.target.value);
                  setPage(1);
                }}
                className={inputClass}
              >
                <option value="all">All ebooks</option>
                <option value="in_stock">Available</option>
                <option value="sold">Purchased</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Sort</label>

              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className={inputClass}
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="price_low_high">Price low to high</option>
                <option value="price_high_low">Price high to low</option>
                <option value="title_az">Title A-Z</option>
              </select>
            </div>

            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="w-full rounded-xl bg-[#053c41] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0f6f7a]"
              >
                Search
              </button>

              <button
                type="button"
                onClick={handleClearFilter}
                className="w-full rounded-xl border border-[#AE7C54]/40 bg-[#f6f1ea] px-4 py-2.5 text-sm font-semibold text-[#053c41] transition hover:bg-[#AE7C54] hover:text-white"
              >
                Clear
              </button>
            </div>
          </form>

          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label className={labelClass}>Min price</label>

              <input
                type="number"
                value={minPrice}
                onChange={(e) => {
                  setMinPrice(e.target.value);
                  setPage(1);
                }}
                placeholder="0"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Max price</label>

              <input
                type="number"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  setPage(1);
                }}
                placeholder="100"
                className={inputClass}
              />
            </div>
          </div>
        </div>

{/* result info */}
<div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
  <p className="text-sm font-medium text-[#053c41]">
    Showing{" "}
    <span className="font-bold text-[#AE7C54]">{ebooks.length}</span>{" "}
    of{" "}
    <span className="font-bold text-[#AE7C54]">{total}</span>{" "}
    ebooks
  </p>

  <p className="text-sm font-medium text-[#053c41]">
    Page{" "}
    <span className="font-bold text-[#AE7C54]">{page}</span>{" "}
    of{" "}
    <span className="font-bold text-[#AE7C54]">{pages || 1}</span>
  </p>
</div>

        {/* loading skeleton */}
        {loading && (
          <div
            id="ebooks-list"
            className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4"
          >
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-2xl border border-[#053c41]/10 bg-white p-3 shadow-sm"
              >
                <div className="h-48 rounded-xl bg-[#053c41]/10 md:h-64" />
                <div className="mt-4 h-4 w-3/4 rounded bg-[#053c41]/10" />
                <div className="mt-2 h-3 w-1/2 rounded bg-[#053c41]/10" />
                <div className="mt-4 h-8 rounded bg-[#053c41]/10" />
              </div>
            ))}
          </div>
        )}

        {/* error message */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center text-red-600">
            {error}
          </div>
        )}

        {/* empty message */}
{!loading && !error && ebooks.length === 0 && (
  <div
    id="ebooks-list"
    className="rounded-3xl border border-[#AE7C54]/20 bg-white p-10 text-center shadow-sm"
  >
    <h2 className="text-2xl font-bold text-[#053c41]">
      No ebooks match your filters
    </h2>

    <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#053c41]/70">
      We could not find any ebooks for your current search, genre, price, or
      availability filter. Try different keywords or clear all filters.
    </p>

    <button
      type="button"
      onClick={handleClearFilter}
      className="mt-5 rounded-xl bg-[#AE7C54] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c99367]"
    >
      Clear Filters
    </button>
  </div>
)}

        {/* ebook grid */}
        {!loading && !error && ebooks.length > 0 && (
          <div
            id="ebooks-list"
            className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4"
          >
            {ebooks.map((ebook) => (
              <Link
                href={`/ebooks/${ebook._id}`}
                key={ebook._id}
                className="group overflow-hidden rounded-2xl border border-[#053c41]/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative bg-[#f6f1ea]">
                  <img
                    src={
                      ebook.coverImage ||
                      "https://placehold.co/400x560?text=Fable+Ebook"
                    }
                    alt={ebook.title}
                    className="h-48 w-full object-cover md:h-64"
                  />

                  {ebook.hasPurchased ? (
                    <span className="absolute left-3 top-3 rounded-full bg-[#AE7C54] px-3 py-1 text-xs font-semibold text-white shadow">
                      Sold
                    </span>
                  ) : (
                    <span className="absolute left-3 top-3 rounded-full bg-[#053c41] px-3 py-1 text-xs font-semibold text-white shadow">
                      Available
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="line-clamp-2 text-sm font-bold text-[#053c41] md:text-base">
                    {ebook.title}
                  </h3>

                  <p className="mt-1 line-clamp-1 text-xs font-medium text-[#0f6f7a] md:text-sm">
                    by {ebook.writerName || "unknown writer"}
                  </p>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span className="line-clamp-1 rounded-full bg-[#f6f1ea] px-3 py-1 text-xs font-semibold text-[#053c41]">
                      {ebook.genre}
                    </span>

                    <span className="text-sm font-bold text-[#AE7C54] md:text-base">
                      ${ebook.price}
                    </span>
                  </div>

                  <button className="mt-4 w-full rounded-xl bg-[#053c41] px-4 py-2 text-sm font-semibold text-white transition group-hover:bg-[#AE7C54]">
                    View Details
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* pagination */}
        {!loading && !error && pages > 1 && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="rounded-xl border border-[#053c41]/20 bg-white px-4 py-2 text-sm font-semibold text-[#053c41] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            {Array.from({ length: pages }).map((_, index) => {
              const pageNumber = index + 1;

              return (
                <button
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  className={`h-10 w-10 rounded-xl text-sm font-semibold transition ${
                    page === pageNumber
                      ? "bg-[#AE7C54] text-white"
                      : "border border-[#053c41]/20 bg-white text-[#053c41] hover:bg-[#f6f1ea]"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              disabled={page === pages}
              onClick={() => setPage((prev) => prev + 1)}
              className="rounded-xl border border-[#053c41]/20 bg-white px-4 py-2 text-sm font-semibold text-[#053c41] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </section>
    </main>
  );
}