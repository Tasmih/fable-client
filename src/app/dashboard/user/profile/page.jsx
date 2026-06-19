"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  BookOpen,
  Bookmark,
  CalendarDays,
  DollarSign,
  Loader2,
  Mail,
  ReceiptText,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import {
  getPurchasedEbooks,
  getPurchaseHistory,
} from "@/lib/actions/users";

export default function UserProfilePage() {
  const { data: session, isPending } = useSession();

  const [purchasedEbooks, setPurchasedEbooks] = useState([]);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const userEmail = session?.user?.email || "";

  // load profile related data
  const loadProfileData = async () => {
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
      toast.error(err.message || "failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isPending) return;

    loadProfileData();
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

  const lastPurchase = purchaseHistory[0];

  if (isPending || loading) {
    return (
      <main className="min-h-screen bg-[#f6f1ea] px-4 py-8 md:px-8">
        <section className="mx-auto flex min-h-[60vh] max-w-5xl items-center justify-center">
          <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
            <Loader2
              size={30}
              className="mx-auto animate-spin text-[#053c41]"
            />

            <p className="mt-3 text-sm font-semibold text-[#053c41]">
              Loading profile...
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
            You need to login to view your profile.
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
      <section className="mx-auto max-w-5xl">
        <Link
          href="/dashboard/user"
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#053c41]/20 bg-white px-5 py-2.5 text-sm font-semibold text-[#053c41] shadow-sm transition hover:bg-[#053c41] hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        {/* profile header */}
        <div className="rounded-3xl bg-[#053c41] p-6 text-white shadow-sm md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#AE7C54]">
            profile management
          </p>

          <div className="mt-5 flex flex-col gap-5 md:flex-row md:items-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white/10 text-white">
              {session?.user?.image ? (
                <img
                  src={session.user.image}
                  alt={session?.user?.name || "user"}
                  className="h-24 w-24 rounded-3xl object-cover"
                />
              ) : (
                <UserRound size={46} />
              )}
            </div>

            <div>
              <h1 className="text-3xl font-bold md:text-4xl">
                {session?.user?.name || "Reader"}
              </h1>

              <p className="mt-2 flex items-center gap-2 text-sm text-white/75">
                <Mail size={16} className="text-[#AE7C54]" />
                {session?.user?.email}
              </p>

              <p className="mt-2 flex items-center gap-2 text-sm text-white/75">
                <ShieldCheck size={16} className="text-[#AE7C54]" />
                Role: {session?.user?.role || "user"}
              </p>
            </div>
          </div>
        </div>

        {/* stats */}
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

        {/* account information */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl bg-white p-5 shadow-sm md:p-6">
            <h2 className="text-2xl font-bold text-[#053c41]">
              Account Information
            </h2>

            <div className="mt-5 space-y-4">
              <div className="rounded-2xl bg-[#f6f1ea] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#AE7C54]">
                  full name
                </p>

                <p className="mt-1 text-sm font-semibold text-[#053c41]">
                  {session?.user?.name || "Not provided"}
                </p>
              </div>

              <div className="rounded-2xl bg-[#f6f1ea] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#AE7C54]">
                  email address
                </p>

                <p className="mt-1 break-all text-sm font-semibold text-[#053c41]">
                  {session?.user?.email}
                </p>
              </div>

              <div className="rounded-2xl bg-[#f6f1ea] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#AE7C54]">
                  account role
                </p>

                <p className="mt-1 text-sm font-semibold text-[#053c41]">
                  {session?.user?.role || "user"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm md:p-6">
            <h2 className="text-2xl font-bold text-[#053c41]">
              Reading Activity
            </h2>

            {lastPurchase ? (
              <div className="mt-5 rounded-2xl bg-[#f6f1ea] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#AE7C54]">
                  last purchase
                </p>

                <h3 className="mt-2 text-base font-bold text-[#053c41]">
                  {lastPurchase.ebookTitle}
                </h3>

                <p className="mt-2 flex items-center gap-2 text-sm text-[#053c41]/70">
                  <CalendarDays size={15} className="text-[#AE7C54]" />
                  {formatDate(lastPurchase.purchaseDate || lastPurchase.createdAt)}
                </p>

                <Link
                  href={`/ebooks/${lastPurchase.ebookId}`}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#053c41] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0f6f7a]"
                >
                  <BookOpen size={15} />
                  Read Ebook
                </Link>
              </div>
            ) : (
              <div className="mt-5 rounded-2xl bg-[#f6f1ea] p-5 text-center">
                <BookOpen size={36} className="mx-auto text-[#AE7C54]" />

                <h3 className="mt-3 text-lg font-bold text-[#053c41]">
                  No reading activity yet
                </h3>

                <p className="mt-1 text-sm text-[#053c41]/70">
                  Purchase an ebook to start your reading journey.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* quick actions */}
        <div className="mt-6 rounded-3xl bg-white p-5 shadow-sm md:p-6">
          <h2 className="text-2xl font-bold text-[#053c41]">Quick Actions</h2>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <Link
              href="/ebooks"
              className="flex items-center justify-center gap-2 rounded-xl bg-[#053c41] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f6f7a]"
            >
              <BookOpen size={16} />
              Browse Ebooks
            </Link>

            <Link
              href="/dashboard/user"
              className="flex items-center justify-center gap-2 rounded-xl border border-[#053c41]/20 bg-white px-5 py-3 text-sm font-semibold text-[#053c41] transition hover:bg-[#053c41] hover:text-white"
            >
              <ReceiptText size={16} />
              Purchase History
            </Link>

            <Link
              href="/dashboard/user/bookmarks"
              className="flex items-center justify-center gap-2 rounded-xl bg-[#AE7C54] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c99367]"
            >
              <Bookmark size={16} />
              My Bookmarks
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}