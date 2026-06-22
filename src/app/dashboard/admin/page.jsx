"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSession } from "@/lib/auth-client";
import { getAdminOverview } from "@/lib/actions/admin";
import {
  BadgeCheck,
  BookOpen,
  CreditCard,
  DollarSign,
  Home,
  Loader2,
  ReceiptText,
  ShieldCheck,
  UserRound,
  UsersRound,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { data: session, isPending } = useSession();

  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  const adminEmail = session?.user?.email || "";

  const loadOverview = async () => {
    if (!adminEmail) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getAdminOverview(adminEmail);
      setOverview(data);
    } catch (err) {
      toast.error(err.message || "failed to load admin overview");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isPending) return;
    loadOverview();
  }, [isPending, adminEmail]);

  const stats = [
    {
      title: "Total Users",
      value: overview?.totalUsers || 0,
      icon: UserRound,
    },
    {
      title: "Readers",
      value: overview?.totalReaders || 0,
      icon: UsersRound,
    },
    {
      title: "Writers",
      value: overview?.totalWriters || 0,
      icon: BadgeCheck,
    },
    {
      title: "Ebooks",
      value: overview?.totalEbooks || 0,
      icon: BookOpen,
    },
    {
      title: "Sold",
      value: overview?.totalSold || 0,
      icon: ReceiptText,
    },
    {
      title: "Transactions",
      value: overview?.totalTransactions || 0,
      icon: CreditCard,
    },
    {
      title: "Revenue",
      value: "$" + Number(overview?.totalRevenue || 0).toFixed(2),
      icon: DollarSign,
    },
    {
      title: "Admins",
      value: overview?.totalAdmins || 0,
      icon: ShieldCheck,
    },
  ];

  if (isPending || loading) {
    return (
      <main className="min-h-screen max-w-full overflow-x-hidden bg-[#f6f1ea]/50 px-4 py-4 md:px-6">
        <section className="mx-auto w-full max-w-7xl rounded-3xl bg-white p-10 text-center shadow-sm">
          <Loader2 size={38} className="mx-auto animate-spin text-[#AE7C54]" />
          <p className="mt-3 text-sm font-semibold text-[#053c41]">
            Loading admin dashboard...
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen max-w-full overflow-x-hidden bg-[#f6f1ea]/50 px-4 py-4 md:px-6">
      <section className="mx-auto w-full max-w-7xl overflow-x-hidden">
      <div className="mb-4 rounded-3xl bg-[#053c41] p-4 text-white shadow-sm md:p-5">
  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
    <div className="min-w-0">
      <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-[#f6f1ea]">
        <ShieldCheck size={16} />
        Admin Dashboard
      </div>

      <h1 className="text-2xl font-bold text-white md:text-3xl">
        Analytics Overview
      </h1>

      <p className="mt-1 text-sm leading-6 text-white/75">
        Manage platform users, writers, ebooks, transactions, and revenue from
        one place.
      </p>
    </div>

    <Link
      href="/"
      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#AE7C54] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c99367]"
    >
      <Home size={16} />
      Go Home
    </Link>
  </div>
</div>

        <div className="mb-4 rounded-3xl bg-white p-4 shadow-sm md:p-5">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-[#053c41]">
              Platform Summary
            </h2>
            <p className="mt-1 text-sm text-[#053c41]/60">
              Quick overview of users, ebooks, sales, and revenue.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="min-w-0 rounded-2xl border border-[#053c41]/10 bg-[#fdfcfb] p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#053c41]/60">
                        {item.title}
                      </p>

                      <h3 className="mt-2 truncate text-3xl font-bold text-[#053c41]">
                        {item.value}
                      </h3>
                    </div>

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f6f1ea] text-[#AE7C54]">
                      <Icon size={23} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-4 shadow-sm md:p-5">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-[#053c41]">
              Recent Transactions
            </h2>
            <p className="mt-1 text-sm text-[#053c41]/60">
              Latest ebook purchases and payment records.
            </p>
          </div>

          <div className="hidden rounded-2xl bg-[#053c41] px-4 py-3 text-sm font-bold text-white lg:grid lg:grid-cols-[0.8fr_1.4fr_1.6fr_0.8fr_0.7fr] lg:gap-3">
            <div>Type</div>
            <div>User Email</div>
            <div>Ebook</div>
            <div>Amount</div>
            <div>Status</div>
          </div>

          {(overview?.recentTransactions || []).length === 0 ? (
            <div className="py-10 text-center text-sm text-[#053c41]/60">
              No transactions found.
            </div>
          ) : (
            <div className="mt-3 space-y-3">
              {overview.recentTransactions.map((item) => (
                <div
                  key={item._id}
                  className="rounded-2xl border border-[#053c41]/10 bg-[#fdfcfb] p-4"
                >
                  <div className="hidden min-w-0 grid-cols-[0.8fr_1.4fr_1.6fr_0.8fr_0.7fr] gap-3 text-sm lg:grid">
                    <div className="min-w-0 truncate font-semibold capitalize text-[#053c41]">
                      {item.type || "N/A"}
                    </div>

                    <div className="min-w-0 truncate text-[#053c41]/70">
                      {item.userEmail || item.buyerEmail || "N/A"}
                    </div>

                    <div className="min-w-0 truncate font-medium text-[#053c41]">
                      {item.ebookTitle || "N/A"}
                    </div>

                    <div className="min-w-0 truncate font-bold text-[#AE7C54]">
                      ${Number(item.amount || 0).toFixed(2)}
                    </div>

                    <div className="min-w-0">
                      <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase text-emerald-700">
                        {item.status || "paid"}
                      </span>
                    </div>
                  </div>

                  <div className="lg:hidden">
                    <div className="flex min-w-0 items-center justify-between gap-3">
                      <h3 className="min-w-0 truncate font-bold text-[#053c41]">
                        {item.ebookTitle || "N/A"}
                      </h3>

                      <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase text-emerald-700">
                        {item.status || "paid"}
                      </span>
                    </div>

                    <p className="mt-2 min-w-0 truncate text-sm text-[#053c41]/70">
                      {item.userEmail || item.buyerEmail || "N/A"}
                    </p>

                    <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                      <span className="min-w-0 truncate font-semibold capitalize text-[#053c41]">
                        {item.type || "N/A"}
                      </span>

                      <span className="shrink-0 font-bold text-[#AE7C54]">
                        ${Number(item.amount || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}