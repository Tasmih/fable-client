"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useSession } from "@/lib/auth-client";
import {
  getBookmarks,
  getPurchasedEbooks,
  getPurchaseHistory,
} from "@/lib/actions/users";
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  CalendarDays,
  DollarSign,
  Loader2,
  Mail,
  ReceiptText,
  Sparkles,
  UserRound,
} from "lucide-react";

export default function UserDashboardPage() {
  const { data: session, isPending } = useSession();

  const [purchasedEbooks, setPurchasedEbooks] = useState([]);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  const userEmail = session?.user?.email || "";

  useEffect(() => {
    if (isPending) return;

    const loadDashboard = async () => {
      if (!userEmail) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const [ebooksData, historyData, bookmarksData] = await Promise.all([
          getPurchasedEbooks(userEmail),
          getPurchaseHistory(userEmail),
          getBookmarks(userEmail),
        ]);

        setPurchasedEbooks(Array.isArray(ebooksData) ? ebooksData : []);
        setPurchaseHistory(Array.isArray(historyData) ? historyData : []);
        setBookmarks(Array.isArray(bookmarksData) ? bookmarksData : []);
      } catch (err) {
        toast.error(err.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [isPending, userEmail]);

  const formatDate = (date) => {
    if (!date) return "Unknown";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const totalSpent = purchaseHistory.reduce(
    (sum, item) => sum + Number(item.amount || item.price || 0),
    0
  );

  const recentPurchases = purchaseHistory.slice(0, 4);
  const recentBooks = purchasedEbooks.slice(0, 4);
  const recentBookmarks = bookmarks.slice(0, 3);

  const isNewReader =
    purchasedEbooks.length === 0 &&
    purchaseHistory.length === 0 &&
    bookmarks.length === 0;

  if (isPending || loading) {
    return (
      <main className="min-h-screen bg-[#f6f1ea]/50 px-4 py-6 md:px-8">
        <section className="mx-auto max-w-7xl">
          <div className="mb-5 h-52 animate-pulse rounded-3xl bg-white shadow-sm" />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-32 animate-pulse rounded-3xl bg-white shadow-sm"
              />
            ))}
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="h-96 animate-pulse rounded-3xl bg-white shadow-sm" />
            <div className="h-96 animate-pulse rounded-3xl bg-white shadow-sm" />
          </div>
        </section>
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="min-h-screen bg-[#f6f1ea]/50 px-4 py-8">
        <section className="mx-auto max-w-3xl rounded-3xl bg-white p-8 text-center shadow-sm">
          <UserRound size={48} className="mx-auto text-[#AE7C54]" />

          <h1 className="mt-4 text-2xl font-bold text-[#053c41]">
            Please login first
          </h1>

          <p className="mt-2 text-sm text-[#053c41]/70">
            You need to login to view your dashboard.
          </p>

          <Link
            href="/auth/signin"
            className="mt-5 inline-flex rounded-xl bg-[#053c41] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f6f7a]"
          >
            Login Now
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f1ea]/50 px-4 py-6 md:px-8">
      <section className="mx-auto max-w-7xl">
        {/* Welcome Banner */}
        <div className="mb-5 overflow-hidden rounded-3xl bg-[#053c41] shadow-sm">
          <div className="relative p-6 md:p-8">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[#AE7C54]/20 blur-3xl" />
            <div className="absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-white/10 blur-3xl" />

            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-[#f6f1ea]">
                  <Sparkles size={16} className="text-[#AE7C54]" />
                  Reader Overview
                </div>

                <h1 className="text-3xl font-bold text-white md:text-4xl">
                  Welcome back, {session?.user?.name || "Reader"}
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#f6f1ea]/75">
                  Track your reading library, saved ebooks, buying records and
                  profile activity from one clean dashboard.
                </p>

                <p className="mt-3 flex items-center gap-2 text-sm text-[#f6f1ea]/70">
                  <Mail size={15} className="text-[#AE7C54]" />
                  {session?.user?.email}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:w-[520px]">
                <Link
                  href="/dashboard/user/purchasedBooks"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#053c41] transition hover:bg-[#f6f1ea]"
                >
                  <BookOpen size={16} />
                  My Books
                </Link>

                <Link
                  href="/dashboard/user/bookmarks"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  <Bookmark size={16} />
                  Bookmarks
                </Link>

                <Link
                  href="/dashboard/user/purchaseHistory"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#AE7C54] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#c99367]"
                >
                  <ReceiptText size={16} />
                  History
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-[#053c41]/60">
              Purchased Books
            </p>

            <div className="mt-4 flex items-center justify-between">
              <h2 className="text-4xl font-bold text-[#053c41]">
                {purchasedEbooks.length}
              </h2>

              <div className="rounded-2xl bg-[#f6f1ea] p-4 text-[#AE7C54]">
                <BookOpen size={28} />
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-[#053c41]/60">
              Saved for Later
            </p>

            <div className="mt-4 flex items-center justify-between">
              <h2 className="text-4xl font-bold text-[#053c41]">
                {bookmarks.length}
              </h2>

              <div className="rounded-2xl bg-[#f6f1ea] p-4 text-[#AE7C54]">
                <Bookmark size={28} />
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-[#053c41]/60">
              Total Spent
            </p>

            <div className="mt-4 flex items-center justify-between">
              <h2 className="text-4xl font-bold text-[#053c41]">
                ${totalSpent.toFixed(2)}
              </h2>

              <div className="rounded-2xl bg-[#f6f1ea] p-4 text-[#AE7C54]">
                <DollarSign size={28} />
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-[#053c41]/60">
              Transactions
            </p>

            <div className="mt-4 flex items-center justify-between">
              <h2 className="text-4xl font-bold text-[#053c41]">
                {purchaseHistory.length}
              </h2>

              <div className="rounded-2xl bg-[#f6f1ea] p-4 text-[#AE7C54]">
                <ReceiptText size={28} />
              </div>
            </div>
          </div>
        </div>

        {/* New User Starter Message */}
        {isNewReader && (
          <div className="mb-5 rounded-3xl bg-white p-6 shadow-sm md:p-8">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.2fr] lg:items-center">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#f6f1ea] px-4 py-2 text-sm font-semibold text-[#AE7C54]">
                  <Sparkles size={16} />
                  Start Your Reading Journey
                </div>

                <h2 className="text-2xl font-bold text-[#053c41] md:text-3xl">
                  Your library is empty right now
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-[#053c41]/70">
                  You have not purchased or bookmarked any ebook yet. Browse
                  original ebooks, save your favorites, and unlock full content
                  after purchase.
                </p>

                <Link
                  href="/ebooks"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#AE7C54] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c99367]"
                >
                  Browse Ebooks
                  <ArrowRight size={16} />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Link
                  href="/ebooks"
                  className="rounded-2xl border border-[#053c41]/10 bg-[#f6f1ea] p-5 transition hover:-translate-y-1 hover:shadow-md"
                >
                  <BookOpen size={28} className="text-[#AE7C54]" />

                  <h3 className="mt-3 font-bold text-[#053c41]">
                    Explore Ebooks
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-[#053c41]/65">
                    Find books by genre, writer, price and title.
                  </p>
                </Link>

                <Link
                  href="/ebooks"
                  className="rounded-2xl border border-[#053c41]/10 bg-[#f6f1ea] p-5 transition hover:-translate-y-1 hover:shadow-md"
                >
                  <Bookmark size={28} className="text-[#AE7C54]" />

                  <h3 className="mt-3 font-bold text-[#053c41]">
                    Save Favorites
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-[#053c41]/65">
                    Bookmark ebooks you want to read or buy later.
                  </p>
                </Link>

                <Link
                  href="/dashboard/user/profile"
                  className="rounded-2xl border border-[#053c41]/10 bg-[#f6f1ea] p-5 transition hover:-translate-y-1 hover:shadow-md"
                >
                  <UserRound size={28} className="text-[#AE7C54]" />

                  <h3 className="mt-3 font-bold text-[#053c41]">
                    View Profile
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-[#053c41]/65">
                    Check your reader profile and account details.
                  </p>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.4fr_0.9fr]">
          {/* Purchased Books Preview */}
          <div className="rounded-3xl bg-white p-5 shadow-sm md:p-6">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#053c41]">
                  Reading Library
                </h2>

                <p className="mt-1 text-sm text-[#053c41]/70">
                  Recently unlocked ebooks from your collection.
                </p>
              </div>

              <Link
                href="/dashboard/user/purchasedBooks"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#053c41] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0f6f7a]"
              >
                View All
                <ArrowRight size={15} />
              </Link>
            </div>

            {recentBooks.length === 0 ? (
              <div className="rounded-2xl bg-[#f6f1ea] p-8 text-center">
                <BookOpen size={42} className="mx-auto text-[#AE7C54]" />

                <h3 className="mt-3 text-xl font-bold text-[#053c41]">
                  No books purchased yet
                </h3>

                <p className="mt-2 text-sm text-[#053c41]/70">
                  Browse ebooks and purchase your first book to start reading.
                </p>

                <Link
                  href="/ebooks"
                  className="mt-5 inline-flex rounded-xl bg-[#AE7C54] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c99367]"
                >
                  Browse Ebooks
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {recentBooks.map((ebook) => (
                  <Link
                    key={ebook._id}
                    href={`/ebooks/${ebook._id}`}
                    className="group flex gap-4 rounded-2xl border border-[#053c41]/10 p-3 transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <img
                      src={
                        ebook.coverImage ||
                        "https://placehold.co/300x420?text=Fable"
                      }
                      alt={ebook.title}
                      className="h-28 w-20 rounded-xl bg-[#f6f1ea] object-contain"
                    />

                    <div className="min-w-0 flex-1">
                      <h3 className="line-clamp-2 font-bold text-[#053c41] group-hover:text-[#AE7C54]">
                        {ebook.title}
                      </h3>

                      <p className="mt-1 line-clamp-1 text-xs text-[#053c41]/60">
                        by {ebook.writerName || "Unknown Writer"}
                      </p>

                      <p className="mt-3 inline-flex items-center gap-1 text-xs text-[#053c41]/60">
                        <CalendarDays size={13} className="text-[#AE7C54]" />
                        {formatDate(ebook.purchaseDate || ebook.createdAt)}
                      </p>

                      <span className="mt-3 inline-flex text-xs font-bold text-[#AE7C54]">
                        Read Now →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="rounded-3xl bg-white p-5 shadow-sm md:p-6">
            <div className="mb-5">
              <h2 className="text-2xl font-bold text-[#053c41]">
                Recent Activity
              </h2>

              <p className="mt-1 text-sm text-[#053c41]/70">
                Your latest purchases and saved ebooks.
              </p>
            </div>

            <div className="space-y-3">
              {recentPurchases.length === 0 && recentBookmarks.length === 0 ? (
                <div className="rounded-2xl bg-[#f6f1ea] p-6 text-center">
                  <Sparkles size={38} className="mx-auto text-[#AE7C54]" />

                  <h3 className="mt-3 text-lg font-bold text-[#053c41]">
                    No activity yet
                  </h3>

                  <p className="mt-2 text-sm text-[#053c41]/70">
                    Your purchases and bookmarks will appear here.
                  </p>
                </div>
              ) : (
                <>
                  {recentPurchases.map((item) => (
                    <div
                      key={`purchase-${item._id}`}
                      className="rounded-2xl border border-[#053c41]/10 p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="rounded-xl bg-green-50 p-3 text-green-700">
                          <ReceiptText size={18} />
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-bold text-[#053c41]">
                            Purchased {item.ebookTitle || "an ebook"}
                          </p>

                          <p className="mt-1 text-xs text-[#053c41]/60">
                            {formatDate(item.purchaseDate || item.createdAt)} ·
                            ${Number(item.amount || item.price || 0).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {recentBookmarks.map((item) => (
                    <div
                      key={`bookmark-${item._id}`}
                      className="rounded-2xl border border-[#053c41]/10 p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="rounded-xl bg-[#f6f1ea] p-3 text-[#AE7C54]">
                          <Bookmark size={18} />
                        </div>

                        <div className="min-w-0">
                          <p className="line-clamp-1 text-sm font-bold text-[#053c41]">
                            Saved {item.title || "an ebook"}
                          </p>

                          <p className="mt-1 text-xs text-[#053c41]/60">
                            Added to your bookmark list
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Purchase History Preview */}
        <div className="mt-5 rounded-3xl bg-white p-5 shadow-sm md:p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#053c41]">
                Purchase Summary
              </h2>

              <p className="mt-1 text-sm text-[#053c41]/70">
                Quick view of your latest ebook transactions.
              </p>
            </div>

            <Link
              href="/dashboard/user/purchaseHistory"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#AE7C54] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#c99367]"
            >
              Full History
              <ArrowRight size={15} />
            </Link>
          </div>

          {recentPurchases.length === 0 ? (
            <div className="rounded-2xl bg-[#f6f1ea] p-8 text-center">
              <ReceiptText size={42} className="mx-auto text-[#AE7C54]" />

              <h3 className="mt-3 text-xl font-bold text-[#053c41]">
                No transaction found
              </h3>

              <p className="mt-2 text-sm text-[#053c41]/70">
                Your payment records will appear here after purchasing ebooks.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-[#053c41]/10">
              <table className="w-full min-w-[760px] text-left">
                <thead className="bg-[#053c41] text-white">
                  <tr>
                    <th className="px-4 py-3 text-sm font-semibold">Ebook</th>
                    <th className="px-4 py-3 text-sm font-semibold">Writer</th>
                    <th className="px-4 py-3 text-sm font-semibold">Price</th>
                    <th className="px-4 py-3 text-sm font-semibold">Date</th>
                    <th className="px-4 py-3 text-sm font-semibold">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#053c41]/10">
                  {recentPurchases.map((item) => (
                    <tr key={item._id} className="bg-white hover:bg-[#f6f1ea]">
                      <td className="px-4 py-3 text-sm font-semibold text-[#053c41]">
                        {item.ebookTitle || "Unknown Ebook"}
                      </td>

                      <td className="px-4 py-3 text-sm text-[#053c41]/70">
                        {item.writerName || item.writerEmail || "Unknown"}
                      </td>

                      <td className="px-4 py-3 text-sm font-bold text-[#AE7C54]">
                        ${Number(item.amount || item.price || 0).toFixed(2)}
                      </td>

                      <td className="px-4 py-3 text-sm text-[#053c41]/70">
                        {formatDate(item.purchaseDate || item.createdAt)}
                      </td>

                      <td className="px-4 py-3">
                        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                          {item.status || "paid"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}