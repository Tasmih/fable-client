"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import {
  BookOpen, Plus, Pencil, Trash2,
  Eye, EyeOff, Loader2, Search, Filter
} from "lucide-react";

// Dummy data to simulate backend response
const DUMMY_BOOKS = [
  {
    _id: "1",
    title: "The Silent Ocean",
    genre: "Fiction",
    price: 9.99,
    status: "published",
    totalSales: 5,
    coverImage: "https://placehold.co/80x110/053c41/f6f1ea?text=Book",
    createdAt: "2026-05-10",
  },
  {
    _id: "2",
    title: "Echoes of Tomorrow",
    genre: "Sci-Fi",
    price: 12.99,
    status: "published",
    totalSales: 4,
    coverImage: "https://placehold.co/80x110/AE7C54/f6f1ea?text=Book",
    createdAt: "2026-05-18",
  },
  {
    _id: "3",
    title: "Midnight Garden",
    genre: "Romance",
    price: 7.99,
    status: "unpublished",
    totalSales: 3,
    coverImage: "https://placehold.co/80x110/053c41/f6f1ea?text=Book",
    createdAt: "2026-06-01",
  },
  {
    _id: "4",
    title: "Dark Horizons",
    genre: "Mystery",
    price: 8.99,
    status: "published",
    totalSales: 0,
    coverImage: "https://placehold.co/80x110/AE7C54/f6f1ea?text=Book",
    createdAt: "2026-06-05",
  },
  {
    _id: "5",
    title: "Beyond the Stars",
    genre: "Fantasy",
    price: 11.99,
    status: "unpublished",
    totalSales: 0,
    coverImage: "https://placehold.co/80x110/053c41/f6f1ea?text=Book",
    createdAt: "2026-06-10",
  },
];

export default function MyBooksPage() {
  const router = useRouter();
  const [books, setBooks] = useState(DUMMY_BOOKS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Filter books by search text and status
  const filtered = books.filter((b) => {
    const matchSearch = b.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || b.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // Toggle publish/unpublish status locally
  const handleToggle = (id, current) => {
    setBooks((prev) =>
      prev.map((b) =>
        b._id === id
          ? { ...b, status: current === "published" ? "unpublished" : "published" }
          : b
      )
    );
    toast.success("Status updated");
  };

  // Delete book locally after confirmation
  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this ebook?")) return;
    setBooks((prev) => prev.filter((b) => b._id !== id));
    toast.success("Ebook deleted");
  };

  return (
    <div className="min-h-screen py-8 px-6" style={{ backgroundColor: "#f6f1ea" }}>

      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#053c41" }}>
            My Books
          </h1>
          <p className="text-sm mt-1" style={{ color: "#053c41", opacity: 0.6 }}>
            Manage all your published and draft ebooks
          </p>
        </div>

        {/* Add new ebook button */}
        <Link
          href="/dashboard/writer/add-ebook"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition w-fit"
          style={{ backgroundColor: "#AE7C54" }}
        >
          <Plus size={16} />
          Add New Ebook
        </Link>
      </div>

      {/* Search and filter bar */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">

        {/* Search input */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "#053c41", opacity: 0.4 }}
          />
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#AE7C54]/40 transition"
            style={{ borderColor: "#053c41/20", color: "#053c41" }}
          />
        </div>

        {/* Status filter buttons */}
        <div
          className="flex gap-1 p-1 rounded-xl"
          style={{ backgroundColor: "#e6f0f0" }}
        >
          {["all", "published", "unpublished"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition"
              style={
                filterStatus === s
                  ? { backgroundColor: "#053c41", color: "#f6f1ea" }
                  : { color: "#053c41", opacity: 0.6 }
              }
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Books table */}
      <div
        className="bg-white rounded-2xl shadow-sm border overflow-hidden"
        style={{ borderColor: "#e5e7eb" }}
      >
        {/* Result count */}
        <div
          className="px-6 py-3 border-b flex items-center gap-2"
          style={{ borderColor: "#e5e7eb", backgroundColor: "#f6f1ea" }}
        >
          <Filter size={14} style={{ color: "#053c41", opacity: 0.5 }} />
          <span className="text-xs" style={{ color: "#053c41", opacity: 0.6 }}>
            Showing {filtered.length} of {books.length} books
          </span>
        </div>

        {/* Empty state */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen
              size={40}
              className="mx-auto mb-3"
              style={{ color: "#053c41", opacity: 0.2 }}
            />
            <p className="text-sm" style={{ color: "#053c41", opacity: 0.5 }}>
              No books found
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">

              {/* Table column headers */}
              <thead>
                <tr style={{ backgroundColor: "#f9fafb" }}>
                  {["Cover", "Title", "Genre", "Price", "Status", "Sales", "Date", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "#053c41", opacity: 0.6 }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filtered.map((book) => (
                  <tr
                    key={book._id}
                    className="border-t hover:bg-[#f6f1ea]/50 transition"
                    style={{ borderColor: "#e5e7eb" }}
                  >
                    {/* Cover image */}
                    <td className="px-6 py-4">
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-9 h-12 object-cover rounded-lg shadow-sm"
                      />
                    </td>

                    {/* Title */}
                    <td
                      className="px-6 py-4 font-medium max-w-[160px] truncate"
                      style={{ color: "#053c41" }}
                    >
                      {book.title}
                    </td>

                    {/* Genre badge */}
                    <td className="px-6 py-4">
                      <span
                        className="text-xs px-2 py-1 rounded-full font-medium"
                        style={{ background: "#e6f0f0", color: "#053c41" }}
                      >
                        {book.genre}
                      </span>
                    </td>

                    {/* Price */}
                    <td
                      className="px-6 py-4 font-semibold"
                      style={{ color: "#AE7C54" }}
                    >
                      ${book.price}
                    </td>

                    {/* Status badge */}
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                          book.status === "published"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {book.status}
                      </span>
                    </td>

                    {/* Sales count */}
                    <td
                      className="px-6 py-4 font-medium"
                      style={{ color: "#053c41" }}
                    >
                      {book.totalSales}
                    </td>

                    {/* Created date */}
                    <td
                      className="px-6 py-4 text-xs"
                      style={{ color: "#053c41", opacity: 0.6 }}
                    >
                      {new Date(book.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>

                    {/* Action buttons */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">

                        {/* Edit */}
                        <button
                          onClick={() => router.push(`/dashboard/writer/edit/${book._id}`)}
                          title="Edit"
                          className="hover:opacity-100 transition"
                          style={{ color: "#053c41", opacity: 0.6 }}
                        >
                          <Pencil size={15} />
                        </button>

                        {/* Toggle publish */}
                        <button
                          onClick={() => handleToggle(book._id, book.status)}
                          title={book.status === "published" ? "Unpublish" : "Publish"}
                          className="hover:opacity-80 transition"
                          style={{ color: "#AE7C54" }}
                        >
                          {book.status === "published"
                            ? <EyeOff size={15} />
                            : <Eye size={15} />
                          }
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(book._id)}
                          title="Delete"
                          className="text-red-400 hover:text-red-500 transition"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}