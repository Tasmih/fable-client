"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSession } from "@/lib/auth-client";
import { getWriterSalesHistory } from "@/lib/actions/writer";
import * as Icons from "@gravity-ui/icons";

const ReceiptIcon = Icons.Receipt || Icons.ChartColumn;
const ClockIcon = Icons.Clock;

const IconView = ({ icon: Icon, className }) => {
  if (!Icon) return null;

  return <Icon className={className} />;
};

export default function WriterSalesHistoryPage() {
  const { data: session, isPending } = useSession();

  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  const userEmail = session?.user?.email || "";

  useEffect(() => {
    if (isPending) return;

    const loadSales = async () => {
      if (!userEmail) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const data = await getWriterSalesHistory(userEmail);
        setSales(Array.isArray(data) ? data : []);
      } catch (err) {
        toast.error(err.message || "failed to load sales history");
      } finally {
        setLoading(false);
      }
    };

    loadSales();
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

  const totalRevenue = sales.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  if (isPending || loading) {
    return (
      <main className="min-h-screen bg-[#f6f1ea]/50 px-4 py-6 md:px-8">
        <section className="mx-auto max-w-7xl rounded-3xl bg-white p-10 text-center shadow-sm">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#AE7C54]/20 border-t-[#AE7C54]" />

          <p className="mt-3 text-sm font-semibold text-[#053c41]">
            Loading sales history...
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f1ea]/50 px-4 py-6 md:px-8">
      <section className="mx-auto max-w-7xl">
        {/* header */}
        <div className="mb-5 rounded-3xl bg-white p-6 shadow-sm md:p-8">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#f6f1ea] px-4 py-2 text-sm font-semibold text-[#AE7C54]">
            <IconView icon={ReceiptIcon} className="h-4 w-4" />
            Sales History
          </div>

          <h1 className="text-3xl font-bold text-[#053c41]">
            Ebook Sales History
          </h1>

          <p className="mt-2 text-sm text-[#053c41]/70">
            Track ebook title, buyer name, purchase date, and amount.
          </p>
        </div>

        {/* stats */}
        <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-[#053c41]/60">
              Total Sales
            </p>

            <h2 className="mt-3 text-3xl font-bold text-[#053c41]">
              {sales.length}
            </h2>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-[#053c41]/60">
              Total Revenue
            </p>

            <h2 className="mt-3 text-3xl font-bold text-[#053c41]">
              {formatMoney(totalRevenue)}
            </h2>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-[#053c41]/60">
              Latest Sale
            </p>

            <h2 className="mt-3 text-xl font-bold text-[#053c41]">
              {sales[0] ? formatDate(sales[0].purchaseDate || sales[0].createdAt) : "none"}
            </h2>
          </div>
        </div>

        {sales.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <IconView
              icon={ReceiptIcon}
              className="mx-auto h-14 w-14 text-[#AE7C54]"
            />

            <h2 className="mt-4 text-2xl font-bold text-[#053c41]">
              No sales found
            </h2>

            <p className="mt-2 text-sm text-[#053c41]/70">
              Your ebook sales will appear here after purchase.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead className="bg-[#053c41] text-white">
                  <tr>
                    <th className="px-5 py-4 text-sm font-semibold">
                      Ebook Title
                    </th>
                    <th className="px-5 py-4 text-sm font-semibold">
                      Buyer Name
                    </th>
                    <th className="px-5 py-4 text-sm font-semibold">
                      Buyer Email
                    </th>
                    <th className="px-5 py-4 text-sm font-semibold">
                      Purchase Date
                    </th>
                    <th className="px-5 py-4 text-right text-sm font-semibold">
                      Amount
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {sales.map((sale) => (
                    <tr
                      key={sale._id}
                      className="border-b border-[#053c41]/10 last:border-0"
                    >
                      <td className="px-5 py-4 font-bold text-[#053c41]">
                        {sale.ebookTitle || "Unknown Ebook"}
                      </td>

                      <td className="px-5 py-4 text-sm text-[#053c41]/75">
                        {sale.buyerName || "unknown buyer"}
                      </td>

                      <td className="px-5 py-4 text-sm text-[#053c41]/75">
                        {sale.buyerEmail}
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-2 text-sm text-[#053c41]/75">
                          <IconView icon={ClockIcon} className="h-4 w-4" />
                          {formatDate(sale.purchaseDate || sale.createdAt)}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right font-bold text-[#AE7C54]">
                        {formatMoney(sale.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}