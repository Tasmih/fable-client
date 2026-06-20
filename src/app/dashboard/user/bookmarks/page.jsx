"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useSession } from "@/lib/auth-client";
import { getBookmarks } from "@/lib/actions/users";
import { removeBookmark } from "@/lib/actions/ebooks";
import {
  ArrowLeft,
  Bookmark,
  BookOpen,
  CalendarDays,
  Home,
  Loader2,
  Trash2,
} from "lucide-react";

export default function UserBookmarksPage() {
  const { data: session, isPending } = useSession();

  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState("");

  const userEmail = session?.user?.email || "";

  const formatDate = (date) => {
    if (!date) return "unknown";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  useEffect(() => {
    if (isPending) return;

    if (!userEmail) {
      setLoading(false);
      return;
    }

    const loadBookmarks = async () => {
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

    loadBookmarks();
  }, [userEmail, isPending]);

  const handleRemoveBookmark = async (ebookId) => {
    try {
      setRemovingId(ebookId);
      await removeBookmark(ebookId, userEmail);

      setBookmarks((prev) => prev.filter((ebook) => ebook._id !== ebookId));
      toast.success("Bookmark removed");
    } catch (err) {
      toast.error(err.message || "failed to remove bookmark");
    } finally {
      setRemovingId("");
    }
  };

  if (loading || isPending) {
    return (
      <main className="min-h-screen bg-[#f6f1ea]/50 px-4 py-6 md:px-8">
        <section className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-3xl bg-white p-4 shadow-sm"
              >
                <div className="h-56 rounded-2xl bg-[#053c41]/10" />
                <div className="mt-4 h-5 w-3/4 rounded bg-[#053c41]/10" />
                <div className="mt-3 h-4 w-1/2 rounded bg-[#053c41]/10" />
                <div className="mt-5 h-10 rounded-xl bg-[#053c41]/10" />
                <div className="mt-3 h-10 rounded-xl bg-[#053c41]/10" />
              </div>
            ))}
          </div>
        </section>
      </main>
    );
  }

  if (!userEmail) {
    return (
      <main className="min-h-screen bg-[#f6f1ea]/50 px-4 py-6 md:px-8">
        <section className="mx-auto max-w-3xl rounded-3xl bg-white p-8 text-center shadow-sm">
          <Bookmark size={48} className="mx-auto text-[#AE7C54]" />

          <h1 className="mt-4 text-2xl font-bold text-[#053c41]">
            Login required
          </h1>

          <p className="mt-2 text-sm text-[#053c41]/70">
            Please login to see your bookmarked ebooks.
          </p>

          <Link
            href="/auth/signin"
            className="mt-5 inline-flex rounded-xl bg-[#053c41] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f6f7a]"
          >
            Go to Login
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f1ea]/50 px-4 py-6 md:px-8">
      <section className="mx-auto max-w-7xl">
        {/* Compact Header with Top Buttons */}
        <div className="mb-5 rounded-3xl bg-white p-5 shadow-sm md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#f6f1ea] px-4 py-2 text-sm font-semibold text-[#AE7C54]">
                <Bookmark size={16} />
                Saved Ebooks
              </div>

              <h1 className="text-3xl font-bold text-[#053c41] md:text-4xl">
                My Bookmarks
              </h1>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-[#053c41]/70">
                Ebooks you saved for reading or purchasing later.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:w-[520px]">
              <Link
                href="/dashboard/user"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#053c41]/20 bg-white px-4 py-3 text-sm font-semibold text-[#053c41] transition hover:border-[#053c41] hover:bg-[#053c41] hover:text-white"
              >
                <ArrowLeft size={16} />
                Dashboard
              </Link>

              <Link
                href="/ebooks"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#AE7C54] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#c99367]"
              >
                <BookOpen size={16} />
                Browse Ebooks
              </Link>

              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#AE7C54]/30 bg-[#f6f1ea] px-4 py-3 text-sm font-semibold text-[#053c41] transition hover:bg-[#053c41] hover:text-white"
              >
                <Home size={16} />
                Home
              </Link>
            </div>
          </div>
        </div>

        {bookmarks.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
            <Bookmark size={48} className="mx-auto text-[#AE7C54]" />

            <h2 className="mt-4 text-2xl font-bold text-[#053c41]">
              No bookmarked ebook yet
            </h2>

            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#053c41]/70">
              Browse ebooks and click the bookmark button to save your favorite
              titles here.
            </p>

            <Link
              href="/ebooks"
              className="mt-5 inline-flex rounded-xl bg-[#053c41] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f6f7a]"
            >
              Explore Ebooks
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {bookmarks.map((ebook) => (
              <div
                key={ebook._id}
                className="rounded-3xl bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <Link href={`/ebooks/${ebook._id}`}>
                  <img
                    src={
                      ebook.coverImage ||
                      "https://placehold.co/400x560?text=Fable+Ebook"
                    }
                    alt={ebook.title}
                    className="h-64 w-full rounded-2xl bg-[#f6f1ea] object-contain"
                  />
                </Link>

                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="rounded-full bg-[#f6f1ea] px-3 py-1 text-xs font-semibold text-[#053c41]">
                      {ebook.genre || "Ebook"}
                    </span>

                    <span className="font-bold text-[#AE7C54]">
                      ${Number(ebook.price || 0).toFixed(2)}
                    </span>
                  </div>

                  <Link href={`/ebooks/${ebook._id}`}>
                    <h2 className="line-clamp-2 text-base font-bold text-[#053c41] transition hover:text-[#AE7C54]">
                      {ebook.title}
                    </h2>
                  </Link>

                  <p className="mt-1 line-clamp-1 text-xs text-[#053c41]/60">
                    by {ebook.writerName || "unknown writer"}
                  </p>

                  <div className="mt-2 flex items-center gap-1 text-xs text-[#053c41]/60">
                    <CalendarDays size={13} className="text-[#AE7C54]" />
                    {formatDate(ebook.createdAt)}
                  </div>

                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#053c41]/65">
                    {ebook.description ||
                      "No description available for this ebook."}
                  </p>

                  <div className="mt-4 flex flex-col gap-2">
                    <Link
                      href={`/ebooks/${ebook._id}`}
                      className="flex items-center justify-center gap-2 rounded-xl bg-[#053c41] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0f6f7a]"
                    >
                      <BookOpen size={15} />
                      View Details
                    </Link>

                    <button
                      onClick={() => handleRemoveBookmark(ebook._id)}
                      disabled={removingId === ebook._id}
                      className="flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {removingId === ebook._id ? (
                        <>
                          <Loader2 size={15} className="animate-spin" />
                          Removing...
                        </>
                      ) : (
                        <>
                          <Trash2 size={15} />
                          Remove
                        </>
                      )}
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