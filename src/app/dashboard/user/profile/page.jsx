"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useSession } from "@/lib/auth-client";
import {
  getPurchasedEbooks,
  getPurchaseHistory,
  getUserProfile,
} from "@/lib/actions/users";
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

export default function UserProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [profile, setProfile] = useState(null);
  const [purchasedEbooks, setPurchasedEbooks] = useState([]);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const userEmail = session?.user?.email || "";

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/auth/signin");
    }
  }, [isPending, session?.user, router]);

  useEffect(() => {
    if (isPending) return;

    const loadProfileData = async () => {
      if (!userEmail) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const [profileData, ebooksData, historyData] = await Promise.all([
          getUserProfile(userEmail).catch(() => null),
          getPurchasedEbooks(userEmail),
          getPurchaseHistory(userEmail),
        ]);

        const finalProfile = profileData || session?.user || {};

        setProfile(finalProfile);
        setPurchasedEbooks(Array.isArray(ebooksData) ? ebooksData : []);
        setPurchaseHistory(Array.isArray(historyData) ? historyData : []);
      } catch (err) {
        toast.error(err.message || "failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [isPending, userEmail, session?.user]);

  const formatDate = (date) => {
    if (!date) return "unknown";

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

  const lastPurchase = purchaseHistory[0];

  const profileName = profile?.name || session?.user?.name || "Reader";
  const profileImage = profile?.image || session?.user?.image || "";
  const profileRole = profile?.role || session?.user?.role || "user";

  if (isPending || loading) {
    return (
      <main className="min-h-screen bg-[#f6f1ea]/50 px-4 py-6 md:px-8">
        <section className="mx-auto max-w-7xl">
          <div className="flex min-h-[50vh] items-center justify-center rounded-3xl bg-white shadow-sm">
            <div className="text-center">
              <Loader2
                size={34}
                className="mx-auto animate-spin text-[#AE7C54]"
              />

              <p className="mt-3 text-sm font-semibold text-[#053c41]">
                Loading profile...
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#f6f1ea]/50 px-4 py-6 md:px-8">
      <section className="mx-auto max-w-7xl">
        {/* top buttons */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/dashboard/user"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#053c41]/20 bg-white px-4 py-3 text-sm font-semibold text-[#053c41] shadow-sm transition hover:bg-[#053c41] hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard/user/updateProfile"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#AE7C54] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#c99367]"
            >
              <UserRound size={16} />
              Update Profile
            </Link>

            <Link
              href="/dashboard/user/bookmarks"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#AE7C54]/30 bg-white px-4 py-3 text-sm font-semibold text-[#053c41] shadow-sm transition hover:bg-[#053c41] hover:text-white"
            >
              <Bookmark size={16} />
              My Bookmarks
            </Link>
          </div>
        </div>

        {/* profile header */}
        <div className="mb-5 rounded-3xl bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            {profileImage ? (
              <img
                src={profileImage}
                alt={profileName}
                referrerPolicy="no-referrer"
                className="h-28 w-28 rounded-3xl object-cover"
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-[#053c41] text-white">
                <UserRound size={44} />
              </div>
            )}

            <div className="flex-1">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#f6f1ea] px-4 py-2 text-sm font-semibold text-[#AE7C54]">
                <ShieldCheck size={16} />
                Profile Management
              </div>

              <h1 className="text-3xl font-bold text-[#053c41] md:text-4xl">
                {profileName}
              </h1>

              <p className="mt-2 flex items-center gap-2 text-sm text-[#053c41]/70">
                <Mail size={15} className="text-[#AE7C54]" />
                {userEmail}
              </p>

              <p className="mt-2 inline-flex rounded-full bg-[#053c41]/5 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#AE7C54]">
                Role: {profileRole}
              </p>
            </div>
          </div>
        </div>

        {/* stats */}
        <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-[#053c41]/60">
              Purchased Ebooks
            </p>

            <div className="mt-3 flex items-center justify-between">
              <h2 className="text-3xl font-bold text-[#053c41]">
                {purchasedEbooks.length}
              </h2>

              <BookOpen size={30} className="text-[#AE7C54]" />
            </div>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-[#053c41]/60">
              Total Spent
            </p>

            <div className="mt-3 flex items-center justify-between">
              <h2 className="text-3xl font-bold text-[#053c41]">
                ${totalSpent.toFixed(2)}
              </h2>

              <DollarSign size={30} className="text-[#AE7C54]" />
            </div>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-[#053c41]/60">
              Transactions
            </p>

            <div className="mt-3 flex items-center justify-between">
              <h2 className="text-3xl font-bold text-[#053c41]">
                {purchaseHistory.length}
              </h2>

              <ReceiptText size={30} className="text-[#AE7C54]" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* account info */}
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-2xl font-bold text-[#053c41]">
                Account Information
              </h2>

              <Link
                href="/dashboard/user/updateProfile"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#AE7C54] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#c99367]"
              >
                <UserRound size={15} />
                Edit
              </Link>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl bg-[#f6f1ea] p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-[#AE7C54]">
                  Full Name
                </p>

                <h3 className="mt-1 text-lg font-bold text-[#053c41]">
                  {profileName}
                </h3>
              </div>

              <div className="rounded-2xl bg-[#f6f1ea] p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-[#AE7C54]">
                  Email Address
                </p>

                <h3 className="mt-1 break-all text-lg font-bold text-[#053c41]">
                  {userEmail}
                </h3>
              </div>

              <div className="rounded-2xl bg-[#f6f1ea] p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-[#AE7C54]">
                  Account Role
                </p>

                <h3 className="mt-1 text-lg font-bold capitalize text-[#053c41]">
                  {profileRole}
                </h3>
              </div>
            </div>
          </div>

          {/* reading activity */}
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-[#053c41]">
              Reading Activity
            </h2>

            {lastPurchase ? (
              <div className="mt-5 rounded-2xl bg-[#f6f1ea] p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-[#AE7C54]">
                  Last Purchase
                </p>

                <h3 className="mt-2 text-xl font-bold text-[#053c41]">
                  {lastPurchase.ebookTitle || "Unknown Ebook"}
                </h3>

                <p className="mt-2 flex items-center gap-2 text-sm text-[#053c41]/70">
                  <CalendarDays size={15} className="text-[#AE7C54]" />
                  {formatDate(lastPurchase.purchaseDate || lastPurchase.createdAt)}
                </p>

                <Link
                  href={`/ebooks/${lastPurchase.ebookId}`}
                  className="mt-5 inline-flex rounded-xl bg-[#053c41] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f6f7a]"
                >
                  Read Ebook
                </Link>
              </div>
            ) : (
              <div className="mt-5 rounded-2xl bg-[#f6f1ea] p-8 text-center">
                <BookOpen size={42} className="mx-auto text-[#AE7C54]" />

                <h3 className="mt-3 text-xl font-bold text-[#053c41]">
                  No reading activity yet
                </h3>

                <p className="mt-2 text-sm text-[#053c41]/70">
                  Purchase an ebook to start your reading journey.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* quick actions */}
        <div className="mt-5 rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-[#053c41]">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
            <Link
              href="/ebooks"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#AE7C54] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#c99367]"
            >
              <BookOpen size={16} />
              Browse Ebooks
            </Link>

            <Link
              href="/dashboard/user/purchasedBooks"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#053c41]/20 px-4 py-3 text-sm font-semibold text-[#053c41] transition hover:bg-[#053c41] hover:text-white"
            >
              <BookOpen size={16} />
              My Books
            </Link>

            <Link
              href="/dashboard/user/purchaseHistory"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#053c41]/20 px-4 py-3 text-sm font-semibold text-[#053c41] transition hover:bg-[#053c41] hover:text-white"
            >
              <ReceiptText size={16} />
              Purchase History
            </Link>

            <Link
              href="/dashboard/user/bookmarks"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#AE7C54]/30 bg-[#f6f1ea] px-4 py-3 text-sm font-semibold text-[#053c41] transition hover:bg-[#053c41] hover:text-white"
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