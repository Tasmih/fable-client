"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSession } from "@/lib/auth-client";
import { getAdminAnalytics } from "@/lib/actions/admin";
import {
  BarChart3,
  Home,
  Loader2,
  PieChart,
  TrendingUp,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart as RePieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = [
  "#053C41",
  "#0567A8",
  "#60E3D5",
  "#D84E55",
  "#FDAB72",
  "#E9C45A",
  "#AE7C54",
  "#0F6F7A",
];

export default function AdminAnalyticsPage() {
  const { data: session, isPending } = useSession();

  const [analytics, setAnalytics] = useState({
    monthlySales: [],
    genreData: [],
    paymentTypeData: [],
  });

  const [loading, setLoading] = useState(true);

  const adminEmail = session?.user?.email || "";

  const loadAnalytics = async () => {
    if (!adminEmail) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getAdminAnalytics(adminEmail);

      setAnalytics({
        monthlySales: Array.isArray(data?.monthlySales)
          ? data.monthlySales
          : [],
        genreData: Array.isArray(data?.genreData) ? data.genreData : [],
        paymentTypeData: Array.isArray(data?.paymentTypeData)
          ? data.paymentTypeData
          : [],
      });
    } catch (err) {
      toast.error(err.message || "failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isPending) return;
    loadAnalytics();
  }, [isPending, adminEmail]);

  const totalAnalyticsRevenue = analytics.monthlySales.reduce((sum, item) => {
    return sum + Number(item.revenue || 0);
  }, 0);

  if (isPending || loading) {
    return (
      <main className="min-h-screen overflow-x-hidden bg-[#f6f1ea] px-4 py-4 md:px-6">
        <section className="mx-auto w-full max-w-7xl rounded-3xl bg-white p-10 text-center shadow-sm">
          <Loader2 size={38} className="mx-auto animate-spin text-[#AE7C54]" />
          <p className="mt-3 text-sm font-semibold text-[#053c41]">
            Loading analytics...
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f6f1ea] px-4 py-4 md:px-6">
      <section className="mx-auto w-full max-w-7xl overflow-x-hidden">
        <div className="mb-4 rounded-3xl bg-[#053c41] p-4 text-white shadow-sm md:p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-[#f6f1ea]">
                <BarChart3 size={16} />
                Analytics
              </div>

              <h1 className="text-2xl font-bold text-white md:text-3xl">
                Platform Analytics
              </h1>

              <p className="mt-1 text-sm leading-6 text-white/75">
                View monthly sales, revenue trends, ebook genres, and payment
                type insights.
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

        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-[#053c41]/60">
              Analytics Revenue
            </p>
            <h2 className="mt-2 text-3xl font-bold text-[#E9C45A]">
              ${Number(totalAnalyticsRevenue || 0).toFixed(2)}
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-[#053c41]/60">
              Genre Groups
            </p>
            <h2 className="mt-2 text-3xl font-bold text-[#053c41]">
              {analytics.genreData.length}
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-[#053c41]/60">
              Payment Types
            </p>
            <h2 className="mt-2 text-3xl font-bold text-[#053c41]">
              {analytics.paymentTypeData.length}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <TrendingUp size={22} className="text-[#E9C45A]" />
              <div>
                <h2 className="text-2xl font-bold text-[#053c41]">
                  Monthly Sales Chart
                </h2>
                <p className="text-sm text-[#053c41]/60">
                  Revenue generated each month.
                </p>
              </div>
            </div>

            <div className="h-[320px]">
              {analytics.monthlySales.length === 0 ? (
                <div className="flex h-full items-center justify-center rounded-2xl bg-[#f6f1ea] text-sm font-semibold text-[#053c41]/60">
                  No monthly sales data found.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.monthlySales}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#d8e5e5" />
                    <XAxis dataKey="month" stroke="#053c41" />
                    <YAxis stroke="#053c41" />
                    <Tooltip />
                    <Bar
                      dataKey="revenue"
                      fill="#E9C45A"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <PieChart size={22} className="text-[#D84E55]" />
              <div>
                <h2 className="text-2xl font-bold text-[#053c41]">
                  Ebooks by Genre
                </h2>
                <p className="text-sm text-[#053c41]/60">
                  Genre-wise ebook distribution.
                </p>
              </div>
            </div>

            <div className="h-[320px]">
              {analytics.genreData.length === 0 ? (
                <div className="flex h-full items-center justify-center rounded-2xl bg-[#f6f1ea] text-sm font-semibold text-[#053c41]/60">
                  No genre data found.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={analytics.genreData}
                      dataKey="count"
                      nameKey="genre"
                      outerRadius={110}
                      label
                    >
                      {analytics.genreData.map((entry, index) => (
                        <Cell
                          key={entry.genre}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RePieChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {analytics.genreData.slice(0, 8).map((item, index) => (
                <div
                  key={item.genre}
                  className="flex items-center gap-2 rounded-full bg-[#f6f1ea] px-3 py-1 text-xs font-semibold text-[#053c41]"
                >
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  {item.genre}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-bold text-[#053c41]">
            Payment Type Summary
          </h2>
          <p className="mt-1 text-sm text-[#053c41]/60">
            Ebook purchase and writer verification payment summary.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {analytics.paymentTypeData.length === 0 ? (
              <div className="rounded-2xl bg-[#f6f1ea] p-5 text-sm font-semibold text-[#053c41]/60">
                No payment type data found.
              </div>
            ) : (
              analytics.paymentTypeData.map((item, index) => (
                <div
                  key={item.type || "payment"}
                  className="rounded-2xl border border-[#053c41]/10 bg-[#fdfcfb] p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold uppercase text-[#053c41]/60">
                      {item.type || "payment"}
                    </p>

                    <span
                      className="h-4 w-4 rounded-full"
                      style={{
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    />
                  </div>

                  <h3 className="mt-2 text-3xl font-bold text-[#053c41]">
                    {item.count || 0}
                  </h3>

                  <p className="mt-1 text-sm font-semibold text-[#AE7C54]">
                    ${Number(item.revenue || 0).toFixed(2)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}