"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useSession } from "@/lib/auth-client";
import { getWriterOverview } from "@/lib/actions/writer";
import * as Icons from "@gravity-ui/icons";

const BookIcon = Icons.BookOpen || Icons.FileText;
const PlusIcon = Icons.Plus;
const SaleIcon = Icons.Receipt || Icons.ChartColumn;
const ChartIcon = Icons.ChartColumn || Icons.Receipt;
const CheckIcon = Icons.CircleCheck || Icons.Check;
const ShieldIcon = Icons.ShieldCheck || Icons.CircleCheck;
const CreditIcon = Icons.CreditCard || Icons.Receipt;
const ClockIcon = Icons.Clock;

const IconView = ({ icon: Icon, className }) => {
  if (!Icon) return null;

  return <Icon className={className} />;
};

export default function WriterDashboardPage() {
  const { data: session, isPending } = useSession();

  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  const userEmail = session?.user?.email || "";

  useEffect(() => {
    if (isPending) return;

    const loadOverview = async () => {
      if (!userEmail) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const data = await getWriterOverview(userEmail);
        setOverview(data);
      } catch (err) {
        toast.error(err.message || "failed to load writer overview");
      } finally {
        setLoading(false);
      }
    };

    loadOverview();
  }, [isPending, userEmail]);

  const formatMoney = (amount) => {
    return `$${Number(amount || 0).toFixed(2)}`;
  };

  const formatDate = (date) => {
    if (!date) return "not available";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const writer = overview?.writer;
  const writerVerified = overview?.writerVerified;

  if (isPending || loading) {
    return (
      <main className="min-h-screen bg-[#f6f1ea]/50 px-4 py-6 md:px-8">
        <section className="mx-auto max-w-7xl">
          <div className="flex min-h-[50vh] items-center justify-center rounded-3xl bg-white shadow-sm">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#AE7C54]/20 border-t-[#AE7C54]" />

              <p className="mt-3 text-sm font-semibold text-[#053c41]">
                Loading writer dashboard...
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f1ea]/50 px-4 py-6 md:px-8">
      <section className="mx-auto max-w-7xl">
        {/* header */}
        <div className="mb-5 rounded-3xl bg-[#053c41] p-6 text-white shadow-sm md:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-[#f6f1ea]">
                <IconView icon={ShieldIcon} className="h-4 w-4" />
                Writer Dashboard
              </div>

              <h1 className="text-3xl font-bold md:text-4xl">
                Welcome, {writer?.name || session?.user?.name || "Writer"}
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75">
                Manage your ebooks, track sales, and publish your writing from
                one organized dashboard.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard/writer/addEbook"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#AE7C54] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c99367]"
              >
                <IconView icon={PlusIcon} className="h-4 w-4" />
                Add Ebook
              </Link>

              <Link
                href="/dashboard/writer/manageEbooks"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-[#053c41]"
              >
                <IconView icon={BookIcon} className="h-4 w-4" />
                Manage Ebooks
              </Link>
            </div>
          </div>
        </div>

        {/* verification notice */}
        {!writerVerified && (
          <div className="mb-5 rounded-3xl border border-[#AE7C54]/25 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#053c41]">
                  Writer verification required
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#053c41]/70">
                  You need to complete one-time writer verification payment
                  before publishing ebooks.
                </p>
              </div>

              <Link
                href="/dashboard/writer/verify"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#053c41] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f6f7a]"
              >
                <IconView icon={CreditIcon} className="h-4 w-4" />
                Verify Now
              </Link>
            </div>
          </div>
        )}

        {/* stats */}
        <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[#053c41]/60">
                Total Ebooks
              </p>

              <IconView icon={BookIcon} className="h-7 w-7 text-[#AE7C54]" />
            </div>

            <h2 className="mt-4 text-3xl font-bold text-[#053c41]">
              {overview?.totalEbooks || 0}
            </h2>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[#053c41]/60">
                Published
              </p>

              <IconView icon={CheckIcon} className="h-7 w-7 text-[#AE7C54]" />
            </div>

            <h2 className="mt-4 text-3xl font-bold text-[#053c41]">
              {overview?.publishedEbooks || 0}
            </h2>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[#053c41]/60">
                Total Sales
              </p>

              <IconView icon={SaleIcon} className="h-7 w-7 text-[#AE7C54]" />
            </div>

            <h2 className="mt-4 text-3xl font-bold text-[#053c41]">
              {overview?.totalSales || 0}
            </h2>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[#053c41]/60">
                Revenue
              </p>

              <IconView icon={ChartIcon} className="h-7 w-7 text-[#AE7C54]" />
            </div>

            <h2 className="mt-4 text-3xl font-bold text-[#053c41]">
              {formatMoney(overview?.totalRevenue)}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {/* recent ebooks */}
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-2xl font-bold text-[#053c41]">
                Recent Ebooks
              </h2>

              <Link
                href="/dashboard/writer/manageEbooks"
                className="text-sm font-semibold text-[#AE7C54] hover:underline"
              >
                View All
              </Link>
            </div>

            {overview?.recentEbooks?.length > 0 ? (
              <div className="space-y-4">
                {overview.recentEbooks.map((ebook) => (
                  <div
                    key={ebook._id}
                    className="flex gap-4 rounded-2xl bg-[#f6f1ea] p-4"
                  >
                    <img
                      src={ebook.coverImage}
                      alt={ebook.title}
                      className="h-20 w-16 rounded-xl object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-bold text-[#053c41]">
                        {ebook.title}
                      </h3>

                      <p className="mt-1 text-sm text-[#053c41]/65">
                        {ebook.genre} · {formatMoney(ebook.price)}
                      </p>

                      <span className="mt-2 inline-flex rounded-full bg-white px-3 py-1 text-xs font-bold capitalize text-[#AE7C54]">
                        {ebook.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl bg-[#f6f1ea] p-8 text-center">
                <IconView
                  icon={BookIcon}
                  className="mx-auto h-11 w-11 text-[#AE7C54]"
                />

                <h3 className="mt-3 text-xl font-bold text-[#053c41]">
                  No ebooks yet
                </h3>

                <p className="mt-2 text-sm text-[#053c41]/70">
                  Add your first ebook to start publishing on Fable.
                </p>

                <Link
                  href="/dashboard/writer/addEbook"
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-[#AE7C54] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c99367]"
                >
                  <IconView icon={PlusIcon} className="h-4 w-4" />
                  Add Ebook
                </Link>
              </div>
            )}
          </div>

          {/* recent sales */}
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-2xl font-bold text-[#053c41]">
                Recent Sales
              </h2>

              <Link
                href="/dashboard/writer/salesHistory"
                className="text-sm font-semibold text-[#AE7C54] hover:underline"
              >
                View All
              </Link>
            </div>

            {overview?.recentSales?.length > 0 ? (
              <div className="space-y-4">
                {overview.recentSales.map((sale) => (
                  <div
                    key={sale._id}
                    className="rounded-2xl bg-[#f6f1ea] p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-[#053c41]">
                          {sale.ebookTitle || "Unknown Ebook"}
                        </h3>

                        <p className="mt-1 text-sm text-[#053c41]/65">
                          Buyer: {sale.buyerEmail}
                        </p>
                      </div>

                      <p className="font-bold text-[#AE7C54]">
                        {formatMoney(sale.amount)}
                      </p>
                    </div>

                    <p className="mt-2 flex items-center gap-2 text-xs font-semibold text-[#053c41]/60">
                      <IconView icon={ClockIcon} className="h-4 w-4" />
                      {formatDate(sale.purchaseDate || sale.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl bg-[#f6f1ea] p-8 text-center">
                <IconView
                  icon={SaleIcon}
                  className="mx-auto h-11 w-11 text-[#AE7C54]"
                />

                <h3 className="mt-3 text-xl font-bold text-[#053c41]">
                  No sales yet
                </h3>

                <p className="mt-2 text-sm text-[#053c41]/70">
                  Sales history will appear here after readers purchase your
                  ebooks.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}