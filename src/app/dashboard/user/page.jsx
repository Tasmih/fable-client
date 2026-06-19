"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import {
  BookOpen,
  Bookmark,
  CalendarDays,
  DollarSign,
  Loader2,
  Mail,
  ReceiptText,
  ShieldCheck,
  ShoppingBag,
  UserRound,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import {
  getPurchasedEbooks,
  getPurchaseHistory,
} from "@/lib/actions/users";

export default function UserDashboardPage() {
  const { data: session, isPending } = useSession();

  const [purchasedEbooks, setPurchasedEbooks] = useState([]);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const userEmail = session?.user?.email || "";

  // load user dashboard data
  const loadUserDashboard = async () => {
    if (!userEmail) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const [ebooksData, historyData] = await Promise.all([
        getPurchasedEbooks(userEmail),
        getPurchaseHistory(userEmail),
      ]);

      setPurchasedEbooks(ebooksData);
      setPurchaseHistory(historyData);
    } catch (err) {
      toast.error(err.message || "failed to load user dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isPending) return;

    loadUserDashboard();
  }, [isPending, userEmail]);

  const formatDate = (date) => {
    if (!date) return "unknown";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const totalSpent = purchaseHistory.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  if (isPending || loading) {
    return (
      <main className="min-h-screen bg-[#f6f1ea] px-4 py-8 md:px-8">
        <section className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center">
          <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
            <Loader2
              size={30}
              className="mx-auto animate-spin text-[#053c41]"
            />

            <p className="mt-3 text-sm font-semibold text-[#053c41]">
              Loading user dashboard...
            </p>
          </div>
        </section>
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="min-h-screen bg-[#f6f1ea] px-4 py-8 md:px-8">
        <section className="mx-auto max-w-3xl rounded-3xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-[#053c41]">
            Please login first
          </h1>

          <p className="mt-2 text-sm text-[#053c41]/70">
            You need to login to view your purchased ebooks.
          </p>

          <Link
            href="/auth/signin"
            className="mt-6 inline-flex rounded-xl bg-[#053c41] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f6f7a]"
          >
            Login Now
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f1ea] px-4 py-8 md:px-8">
      <section className="mx-auto max-w-7xl">
        {/* dashboard header */}
        <div className="rounded-3xl bg-[#053c41] p-6 text-white shadow-sm md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#AE7C54]">
            user dashboard
          </p>

          <h1 className="mt-2 text-3xl font-bold md:text-4xl">
            Welcome, {session?.user?.name || "Reader"}
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75">
            Manage your purchased ebooks, read unlocked content and check your
            payment history.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/ebooks"
              className="inline-flex items-center gap-2 rounded-xl bg-[#AE7C54] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c99367]"
            >
              <BookOpen size={16} />
              Browse Ebooks
            </Link>

            <Link
              href="/dashboard/user/bookmarks"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-[#053c41]"
            >
              <Bookmark size={16} />
              My Bookmarks
            </Link>
          </div>
        </div>

        {/* stats cards */}
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f6f1ea] text-[#AE7C54]">
                <BookOpen size={23} />
              </div>

              <div>
                <p className="text-sm text-[#053c41]/60">Purchased Ebooks</p>
                <h2 className="text-2xl font-bold text-[#053c41]">
                  {purchasedEbooks.length}
                </h2>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f6f1ea] text-[#AE7C54]">
                <DollarSign size={23} />
              </div>

              <div>
                <p className="text-sm text-[#053c41]/60">Total Spent</p>
                <h2 className="text-2xl font-bold text-[#053c41]">
                  ${totalSpent.toFixed(2)}
                </h2>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f6f1ea] text-[#AE7C54]">
                <ReceiptText size={23} />
              </div>

              <div>
                <p className="text-sm text-[#053c41]/60">Transactions</p>
                <h2 className="text-2xl font-bold text-[#053c41]">
                  {purchaseHistory.length}
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* profile section */}
        <div className="mt-6 rounded-3xl bg-white p-5 shadow-sm md:p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#053c41] text-white">
                {session?.user?.image ? (
                  <img
                    src={session.user.image}
                    alt={session?.user?.name || "user"}
                    className="h-16 w-16 rounded-2xl object-cover"
                  />
                ) : (
                  <UserRound size={30} />
                )}
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#053c41]">
                  {session?.user?.name || "Reader Profile"}
                </h2>

                <p className="mt-1 flex items-center gap-2 text-sm text-[#053c41]/70">
                  <Mail size={15} className="text-[#AE7C54]" />
                  {session?.user?.email}
                </p>

                <p className="mt-1 flex items-center gap-2 text-sm text-[#053c41]/70">
                  <ShieldCheck size={15} className="text-[#AE7C54]" />
                  Role: {session?.user?.role || "user"}
                </p>
              </div>
            </div>

            <Link
              href="/dashboard/user/profile"
              className="inline-flex items-center justify-center rounded-xl border border-[#053c41]/20 px-5 py-3 text-sm font-semibold text-[#053c41] transition hover:bg-[#053c41] hover:text-white"
            >
              View Profile
            </Link>
          </div>
        </div>

        {/* purchased ebooks */}
        <div className="mt-8">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#053c41]">
                My Purchased Ebooks
              </h2>

              <p className="mt-1 text-sm text-[#053c41]/65">
                Books you have unlocked through Stripe payment.
              </p>
            </div>

            <Link
              href="/ebooks"
              className="inline-flex items-center justify-center rounded-xl bg-[#053c41] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0f6f7a]"
            >
              Browse More
            </Link>
          </div>

          {purchasedEbooks.length === 0 ? (
            <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
              <ShoppingBag size={42} className="mx-auto text-[#AE7C54]" />

              <h3 className="mt-4 text-xl font-bold text-[#053c41]">
                No purchased ebook yet
              </h3>

              <p className="mt-2 text-sm text-[#053c41]/70">
                Buy an ebook to unlock and read its full content.
              </p>

              <Link
                href="/ebooks"
                className="mt-5 inline-flex rounded-xl bg-[#AE7C54] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c99367]"
              >
                Explore Ebooks
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {purchasedEbooks.map((ebook) => (
                <div
                  key={ebook._id}
                  className="rounded-2xl bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <Link href={`/ebooks/${ebook._id}`}>
                    <img
                      src={
                        ebook.coverImage ||
                        "https://placehold.co/400x560?text=Fable+Ebook"
                      }
                      alt={ebook.title}
                      className="h-52 w-full rounded-xl bg-[#f6f1ea] object-contain md:h-64"
                    />
                  </Link>

                  <div className="mt-3">
                    <h3 className="line-clamp-2 text-sm font-bold text-[#053c41]">
                      {ebook.title}
                    </h3>

                    <p className="mt-1 line-clamp-1 text-xs text-[#053c41]/60">
                      by {ebook.writerName || "unknown writer"}
                    </p>

                    <div className="mt-2 flex items-center gap-1 text-xs text-[#053c41]/60">
                      <CalendarDays size={13} className="text-[#AE7C54]" />
                      {formatDate(ebook.purchaseDate)}
                    </div>

                    <Link
                      href={`/ebooks/${ebook._id}`}
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#053c41] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#0f6f7a]"
                    >
                      <BookOpen size={14} />
                      Read Ebook
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* purchase history */}
        <div className="mt-10 rounded-3xl bg-white p-5 shadow-sm md:p-6">
          <div>
            <h2 className="text-2xl font-bold text-[#053c41]">
              Purchase History
            </h2>

            <p className="mt-1 text-sm text-[#053c41]/65">
              Your Stripe purchase records are listed here.
            </p>
          </div>

          {purchaseHistory.length === 0 ? (
            <p className="mt-5 text-sm text-[#053c41]/70">
              No transaction found.
            </p>
          ) : (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[#053c41]/10 text-[#053c41]">
                    <th className="py-3 pr-4 font-bold">Ebook</th>
                    <th className="py-3 pr-4 font-bold">Writer</th>
                    <th className="py-3 pr-4 font-bold">Amount</th>
                    <th className="py-3 pr-4 font-bold">Status</th>
                    <th className="py-3 pr-4 font-bold">Date</th>
                    <th className="py-3 pr-4 font-bold">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {purchaseHistory.map((item) => (
                    <tr
                      key={item._id || item.transactionId}
                      className="border-b border-[#053c41]/10 text-[#053c41]/75"
                    >
                      <td className="py-4 pr-4 font-semibold text-[#053c41]">
                        {item.ebookTitle}
                      </td>

                      <td className="py-4 pr-4">
                        {item.writerName || item.writerEmail || "unknown"}
                      </td>

                      <td className="py-4 pr-4 font-bold text-[#AE7C54]">
                        ${Number(item.amount || 0).toFixed(2)}
                      </td>

                      <td className="py-4 pr-4">
                        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                          {item.status || "paid"}
                        </span>
                      </td>

                      <td className="py-4 pr-4">
                        {formatDate(item.purchaseDate || item.createdAt)}
                      </td>

                      <td className="py-4 pr-4">
                       
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