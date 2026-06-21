"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useSession } from "@/lib/auth-client";
import { getBookmarks } from "@/lib/actions/users";
import { removeBookmark } from "@/lib/actions/ebooks";
import { Bookmark, FileText, TrashBin, BookOpen } from "@gravity-ui/icons";

export default function WriterBookmarksPage() {
  const { data: session, isPending } = useSession();

  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState("");

  const userEmail = session?.user?.email || "";

  const loadBookmarks = async () => {
    if (!userEmail) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const data = await getBookmarks(userEmail);
      setBookmarks(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(err.message || "failed to load bookmarks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isPending) return;

    loadBookmarks();
  }, [isPending, userEmail]);

  const handleRemoveBookmark = async (ebookId) => {
    try {
      setRemovingId(ebookId);

      await removeBookmark(ebookId, userEmail);

      setBookmarks((prev) => prev.filter((ebook) => ebook._id !== ebookId));
      toast.success("bookmark removed");
    } catch (err) {
      toast.error(err.message || "failed to remove bookmark");
    } finally {
      setRemovingId("");
    }
  };

  const formatMoney = (amount) => {
    return `$${Number(amount || 0).toFixed(2)}`;
  };

  if (isPending || loading) {
    return (
      <main className="min-h-screen bg-[#f6f1ea]/50 px-4 py-6 md:px-8">
        <section className="mx-auto max-w-7xl rounded-3xl bg-white p-10 text-center shadow-sm">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#AE7C54]/20 border-t-[#AE7C54]" />

          <p className="mt-3 text-sm font-semibold text-[#053c41]">
            Loading bookmarks...
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f1ea]/50 px-4 py-6 md:px-8">
      <section className="mx-auto max-w-7xl">
        {/* header */}
        <div className="mb-5 rounded-3xl bg-white p-6 shadow-sm md:p-8">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#f6f1ea] px-4 py-2 text-sm font-semibold text-[#AE7C54]">
            <Bookmark className="h-4 w-4" />
            Writer Bookmarks
          </div>

          <h1 className="text-3xl font-bold text-[#053c41]">Saved Ebooks</h1>

          <p className="mt-2 text-sm text-[#053c41]/70">
            Ebooks you saved for reading or checking later.
          </p>
        </div>

        {bookmarks.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <Bookmark className="mx-auto h-14 w-14 text-[#AE7C54]" />

            <h2 className="mt-4 text-2xl font-bold text-[#053c41]">
              No bookmarked ebooks
            </h2>

            <p className="mt-2 text-sm text-[#053c41]/70">
              Browse ebooks and save interesting titles here.
            </p>

            <Link
              href="/ebooks"
              className="mt-5 inline-flex rounded-xl bg-[#053c41] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f6f7a]"
            >
              Browse Ebooks
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {bookmarks.map((ebook) => (
              <div
                key={ebook._id}
                className="overflow-hidden rounded-3xl bg-white shadow-sm"
              >
                {ebook.coverImage ? (
                  <img
                    src={ebook.coverImage}
                    alt={ebook.title}
                    className="h-64 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-64 items-center justify-center bg-[#f6f1ea]">
                    <BookOpen className="h-12 w-12 text-[#AE7C54]" />
                  </div>
                )}

                <div className="p-5">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="rounded-full bg-[#f6f1ea] px-3 py-1 text-xs font-bold text-[#AE7C54]">
                      {ebook.genre || "Ebook"}
                    </span>

                    <span className="text-sm font-bold text-[#053c41]">
                      {formatMoney(ebook.price)}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-[#053c41]">
                    {ebook.title}
                  </h2>

                  <p className="mt-1 text-sm text-[#053c41]/65">
                    By {ebook.writerName || "Unknown Writer"}
                  </p>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#053c41]/70">
                    {ebook.description}
                  </p>

                  <div className="mt-5 grid grid-cols-1 gap-3">
                    <Link
                      href={`/ebooks/${ebook._id}`}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#053c41] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0f6f7a]"
                    >
                      <FileText className="h-4 w-4" />
                      View Details
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleRemoveBookmark(ebook._id)}
                      disabled={removingId === ebook._id}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-600 hover:text-white disabled:opacity-60"
                    >
                      <TrashBin className="h-4 w-4" />
                      {removingId === ebook._id ? "Removing..." : "Remove"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}