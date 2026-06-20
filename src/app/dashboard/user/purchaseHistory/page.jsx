"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useSession } from "@/lib/auth-client";
import { getPurchaseHistory } from "@/lib/actions/users";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  DollarSign,
  Loader2,
  ReceiptText,
} from "lucide-react";

export default function UserPurchaseHistoryPage() {
  const { data: session, isPending } = useSession();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const userEmail = session?.user?.email || "";

  const formatDate = (date) => {
    if (!date) return "Unknown";

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

    const loadHistory = async () => {
      try {
        setLoading(true);
        const data = await getPurchaseHistory(userEmail);
        setHistory(Array.isArray(data) ? data : []);
      } catch (err) {
        toast.error(err.message || "Failed to load purchase history");
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [isPending, userEmail]);

  const totalSpent = history.reduce(
    (sum, item) => sum + Number(item.amount || item.price || 0),
    0
  );

  if (loading || isPending) {
    return (
      <main className="min-h-screen bg-[#f6f1ea]/50 px-4 py-6 md:px-8">
        <section className="mx-auto max-w-7xl rounded-3xl bg-white p-10 text-center shadow-sm">
          <Loader2 size={36} className="mx-auto animate-spin text-[#AE7C54]" />
          <p className="mt-3 text-sm font-semibold text-[#053c41]">
            Loading purchase history...
          </p>
        </section>
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="min-h-screen bg-[#f6f1ea]/50 px-4 py-6 md:px-8">
        <section className="mx-auto max-w-3xl rounded-3xl bg-white p-10 text-center shadow-sm">
          <ReceiptText size={48} className="mx-auto text-[#AE7C54]" />

          <h1 className="mt-4 text-2xl font-bold text-[#053c41]">
            Login Required
          </h1>

          <p className="mt-2 text-sm text-[#053c41]/70">
            Please login to view your purchase history.
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
        {/* Header */}
        <div className="mb-5 rounded-3xl bg-white p-5 shadow-sm md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#f6f1ea] px-4 py-2 text-sm font-semibold text-[#AE7C54]">
                <ReceiptText size={16} />
                Buying Records
              </div>

              <h1 className="text-3xl font-bold text-[#053c41] md:text-4xl">
                Purchase History
              </h1>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-[#053c41]/70">
                View your ebook name, writer, price, purchase date, and payment
                status.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:w-[360px]">
              <Link
                href="/dashboard/user"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#053c41]/20 bg-white px-4 py-3 text-sm font-semibold text-[#053c41] transition hover:bg-[#053c41] hover:text-white"
              >
                <ArrowLeft size={16} />
                Dashboard
              </Link>

              <Link
                href="/dashboard/user/purchasedBooks"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#AE7C54] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#c99367]"
              >
                <BookOpen size={16} />
                My Books
              </Link>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-[#053c41]/60">
              Total Purchases
            </p>

            <div className="mt-3 flex items-center justify-between">
              <h2 className="text-3xl font-bold text-[#053c41]">
                {history.length}
              </h2>

              <div className="rounded-2xl bg-[#f6f1ea] p-4 text-[#AE7C54]">
                <ReceiptText size={28} />
              </div>
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

              <div className="rounded-2xl bg-[#f6f1ea] p-4 text-[#AE7C54]">
                <DollarSign size={28} />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-3xl bg-white p-5 shadow-sm md:p-6">
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-[#053c41]">
              Buying History Table
            </h2>

            <p className="mt-1 text-sm text-[#053c41]/70">
              All successful ebook purchases are listed below.
            </p>
          </div>

          {history.length === 0 ? (
            <div className="rounded-2xl bg-[#f6f1ea] p-10 text-center">
              <ReceiptText size={46} className="mx-auto text-[#AE7C54]" />

              <h3 className="mt-4 text-xl font-bold text-[#053c41]">
                No purchase history found
              </h3>

              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#053c41]/70">
                After you buy an ebook successfully, the ebook name, writer,
                price, purchase date, and status will appear here.
              </p>

              <Link
                href="/ebooks"
                className="mt-5 inline-flex rounded-xl bg-[#053c41] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f6f7a]"
              >
                Browse Ebooks
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-[#053c41]/10">
              <table className="w-full min-w-[850px] text-left">
                <thead className="bg-[#053c41] text-white">
                  <tr>
                    <th className="px-4 py-3 text-sm font-semibold">
                      Ebook Name
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold">
                      Writer
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold">
                      Price
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold">
                      Purchase Date
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold">
                      Status
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#053c41]/10">
                  {history.map((item) => (
                    <tr key={item._id} className="bg-white hover:bg-[#f6f1ea]">
                      <td className="px-4 py-4 text-sm font-semibold text-[#053c41]">
                        {item.ebookTitle || item.title || "Unknown Ebook"}
                      </td>

                      <td className="px-4 py-4 text-sm text-[#053c41]/70">
                        {item.writerName || item.writerEmail || "Unknown"}
                      </td>

                      <td className="px-4 py-4 text-sm font-bold text-[#AE7C54]">
                        ${Number(item.amount || item.price || 0).toFixed(2)}
                      </td>

                      <td className="px-4 py-4 text-sm text-[#053c41]/70">
                        <span className="inline-flex items-center gap-1">
                          <CalendarDays size={14} className="text-[#AE7C54]" />
                          {formatDate(item.purchaseDate || item.createdAt)}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                          {item.status || "paid"}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        {item.ebookId ? (
                          <Link
                            href={`/ebooks/${item.ebookId}`}
                            className="inline-flex rounded-lg bg-[#053c41] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#0f6f7a]"
                          >
                            Read
                          </Link>
                        ) : (
                          <span className="text-xs text-[#053c41]/50">
                            No link
                          </span>
                        )}
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