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
  BookOpen,
  Bookmark,
  CreditCard,
  DollarSign,
  Loader2,
  Mail,
  Pencil,
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

        setProfile(profileData || session?.user || {});
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

  const totalSpent = purchaseHistory.reduce(
    (sum, item) => sum + Number(item.amount || item.price || 0),
    0
  );

  const profileName = profile?.name || session?.user?.name || "Reader";
  const profileImage = profile?.image || session?.user?.image || "";
  const profileRole = profile?.role || session?.user?.role || "user";

  if (isPending || loading) {
    return (
      <main className="min-h-screen bg-[#f6f1ea]/50 px-4 py-6 md:px-8">
        <section className="mx-auto max-w-5xl rounded-3xl bg-white p-10 text-center shadow-sm">
          <Loader2
            size={34}
            className="mx-auto animate-spin text-[#AE7C54]"
          />

          <p className="mt-3 text-sm font-semibold text-[#053c41]">
            Loading profile...
          </p>
        </section>
      </main>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#f6f1ea]/50 px-4 py-6 md:px-8">
      <section className="mx-auto max-w-5xl">
        <div className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#f6f1ea] px-4 py-2 text-sm font-semibold text-[#AE7C54]">
                <UserRound size={16} />
                User Profile
              </div>

              <h1 className="text-3xl font-bold text-[#053c41] md:text-4xl">
                Profile Information
              </h1>

              <p className="mt-2 text-sm text-[#053c41]/70">
                View your account details, purchased ebooks, and purchase
                activity.
              </p>
            </div>

            <Link
              href="/dashboard/user/updateProfile"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#AE7C54] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c99367]"
            >
              <Pencil size={16} />
              Update Profile
            </Link>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
            <div className="rounded-3xl bg-[#f6f1ea] p-5 text-center">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt={profileName}
                  referrerPolicy="no-referrer"
                  className="mx-auto h-36 w-36 rounded-full border-4 border-[#AE7C54]/30 object-cover"
                />
              ) : (
                <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full bg-[#AE7C54] text-5xl font-bold text-white">
                  {profileName.charAt(0).toUpperCase()}
                </div>
              )}

              <h2 className="mt-4 text-2xl font-bold text-[#053c41]">
                {profileName}
              </h2>

              <p className="mt-1 break-all text-sm text-[#053c41]/70">
                {userEmail}
              </p>

              <div className="mt-4 flex justify-center">
                <span className="rounded-full bg-white px-4 py-2 text-xs font-bold uppercase text-[#AE7C54]">
                  {profileRole}
                </span>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-2xl border border-[#053c41]/10 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f6f1ea] text-[#AE7C54]">
                    <UserRound size={20} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase text-[#053c41]/50">
                      Name
                    </p>

                    <p className="text-lg font-bold text-[#053c41]">
                      {profileName}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#053c41]/10 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f6f1ea] text-[#AE7C54]">
                    <Mail size={20} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase text-[#053c41]/50">
                      Email
                    </p>

                    <p className="break-all text-lg font-bold text-[#053c41]">
                      {userEmail}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#053c41]/10 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f6f1ea] text-[#AE7C54]">
                    <ShieldCheck size={20} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase text-[#053c41]/50">
                      Role
                    </p>

                    <p className="text-lg font-bold capitalize text-[#053c41]">
                      {profileRole}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#053c41]/10 bg-white p-5">
                <p className="text-xs font-semibold uppercase text-[#053c41]/50">
                  Bio
                </p>

                <p className="mt-2 leading-7 text-[#053c41]/80">
                  {profile?.bio || "No bio added yet."}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
            <div className="rounded-3xl bg-[#f6f1ea] p-5">
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

            <div className="rounded-3xl bg-[#f6f1ea] p-5">
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

            <div className="rounded-3xl bg-[#f6f1ea] p-5">
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

          

          <div className="mt-8 rounded-3xl bg-white">
            <h2 className="mb-4 text-xl font-bold text-[#053c41]">
              Quick Actions
            </h2>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <Link
                href="/dashboard/user/purchasedBooks"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#AE7C54] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#c99367]"
              >
                <BookOpen size={16} />
                Purchased Books
              </Link>

              <Link
                href="/dashboard/user/purchaseHistory"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#053c41]/20 px-4 py-3 text-sm font-semibold text-[#053c41] transition hover:bg-[#053c41] hover:text-white"
              >
                <CreditCard size={16} />
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
        </div>
      </section>
    </main>
  );
}
