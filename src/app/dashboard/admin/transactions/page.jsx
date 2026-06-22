"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSession } from "@/lib/auth-client";
import { getAdminTransactions } from "@/lib/actions/admin";
import {
  CreditCard,
  DollarSign,
  Home,
  Loader2,
  ReceiptText,
} from "lucide-react";

export default function AdminTransactionsPage() {
  const { data: session, isPending } = useSession();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const adminEmail = session?.user?.email || "";

  const loadTransactions = async () => {
    if (!adminEmail) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getAdminTransactions(adminEmail);
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(err.message || "failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isPending) return;
    loadTransactions();
  }, [isPending, adminEmail]);

  const formatMoney = (amount) => {
    return "$" + Number(amount || 0).toFixed(2);
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const totalAmount = transactions.reduce((sum, item) => {
    return sum + Number(item.amount || 0);
  }, 0);

  if (isPending || loading) {
    return (
      <main className="min-h-screen overflow-x-hidden bg-[#f6f1ea] px-4 py-4 md:px-6">
        <section className="mx-auto w-full max-w-7xl rounded-3xl bg-white p-10 text-center shadow-sm">
          <Loader2 size={38} className="mx-auto animate-spin text-[#AE7C54]" />
          <p className="mt-3 text-sm font-semibold text-[#053c41]">
            Loading transactions...
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
                <CreditCard size={16} />
                All Transactions
              </div>

              <h1 className="text-2xl font-bold text-white md:text-3xl">
                Payment Records
              </h1>

              <p className="mt-1 text-sm leading-6 text-white/75">
                Track ebook purchases, writer verification payments, amount, and
                status.
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
              Total Transactions
            </p>
            <h2 className="mt-2 text-3xl font-bold text-[#053c41]">
              {transactions.length}
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-[#053c41]/60">
              Total Amount
            </p>
            <h2 className="mt-2 text-3xl font-bold text-[#AE7C54]">
              {formatMoney(totalAmount)}
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-[#053c41]/60">
              Paid Records
            </p>
            <h2 className="mt-2 text-3xl font-bold text-[#053c41]">
              {transactions.filter((item) => item.status === "paid").length}
            </h2>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-4 shadow-sm md:p-5">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-[#053c41]">
              Transaction List
            </h2>
            <p className="mt-1 text-sm text-[#053c41]/60">
              Requirement: transaction ID, type, user/writer email, amount, date.
            </p>
          </div>

          {transactions.length === 0 ? (
            <div className="py-12 text-center">
              <ReceiptText size={46} className="mx-auto text-[#AE7C54]" />
              <h3 className="mt-3 text-xl font-bold text-[#053c41]">
                No transactions found
              </h3>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((item) => (
                <div
                  key={item._id}
                  className="rounded-2xl border border-[#053c41]/10 bg-[#fdfcfb] p-4"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                      <div className="mb-2 flex flex-wrap gap-2">
                        <span className="rounded-full bg-[#f6f1ea] px-3 py-1 text-xs font-bold uppercase text-[#053c41]">
                          {item.type || "payment"}
                        </span>

                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase text-emerald-700">
                          {item.status || "paid"}
                        </span>
                      </div>

                      <h3 className="truncate text-lg font-bold text-[#053c41]">
                        {item.ebookTitle || "Writer Verification Payment"}
                      </h3>

                      <p className="mt-1 break-all text-sm text-[#053c41]/70">
                        Transaction ID:{" "}
                        {item.transactionId || item.stripeSessionId || "N/A"}
                      </p>

                      <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-[#053c41]/70 md:grid-cols-2">
                        <p className="break-all">
                          Buyer/User:{" "}
                          <span className="font-semibold">
                            {item.buyerEmail || item.userEmail || "N/A"}
                          </span>
                        </p>

                        <p className="break-all">
                          Writer:{" "}
                          <span className="font-semibold">
                            {item.writerEmail || "N/A"}
                          </span>
                        </p>

                        <p>
                          Date:{" "}
                          <span className="font-semibold">
                            {formatDate(item.createdAt || item.purchaseDate)}
                          </span>
                        </p>

                        <p>
                          Currency:{" "}
                          <span className="font-semibold uppercase">
                            {item.currency || "usd"}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-3 rounded-2xl bg-[#f6f1ea] px-5 py-4">
                      <DollarSign size={22} className="text-[#AE7C54]" />
                      <div>
                        <p className="text-xs font-semibold text-[#053c41]/60">
                          Amount
                        </p>
                        <p className="text-2xl font-bold text-[#AE7C54]">
                          {formatMoney(item.amount)}
                        </p>
                      </div>
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