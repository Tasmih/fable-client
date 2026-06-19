"use client";

import { useState } from "react";
import { TrendingUp, DollarSign, ShoppingBag, Loader2, Search } from "lucide-react";
import { useSession } from "@/lib/auth-client";

// Dummy sales data to simulate backend response
const DUMMY_SALES = [
  {
    _id: "t1",
    ebookTitle: "The Silent Ocean",
    buyerName: "Alice Johnson",
    buyerEmail: "alice@example.com",
    amount: 9.99,
    purchaseDate: "2026-06-10",
  },
  {
    _id: "t2",
    ebookTitle: "Echoes of Tomorrow",
    buyerName: "Bob Smith",
    buyerEmail: "bob@example.com",
    amount: 12.99,
    purchaseDate: "2026-06-12",
  },
  {
    _id: "t3",
    ebookTitle: "The Silent Ocean",
    buyerName: "Carol White",
    buyerEmail: "carol@example.com",
    amount: 9.99,
    purchaseDate: "2026-06-14",
  },
  {
    _id: "t4",
    ebookTitle: "Midnight Garden",
    buyerName: "David Lee",
    buyerEmail: "david@example.com",
    amount: 7.99,
    purchaseDate: "2026-06-15",
  },
  {
    _id: "t5",
    ebookTitle: "Echoes of Tomorrow",
    buyerName: "Emma Davis",
    buyerEmail: "emma@example.com",
    amount: 12.99,
    purchaseDate: "2026-06-17",
  },
];

export default function SalesHistoryPage() {
  const { data: session, isPending } = useSession();
  const [sales] = useState(DUMMY_SALES);
  const [search, setSearch] = useState("");

  // Show spinner while session loads
  if (isPending) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin" size={36} style={{ color: "#AE7C54" }} />
      </div>
    );
  }

  // Filter sales by ebook title or buyer name
  const filtered = sales.filter(
    (s) =>
      s.ebookTitle.toLowerCase().includes(search.toLowerCase()) ||
      s.buyerName.toLowerCase().includes(search.toLowerCase())
  );

  // Calculate summary stats from sales data
  const totalRevenue = sales.reduce((sum, s) => sum + s.amount, 0);
  const totalSales = sales.length;
  const uniqueBooks = [...new Set(sales.map((s) => s.ebookTitle))].length;

  const statCards = [
    { label: "Total Sales", value: totalSales, icon: ShoppingBag },
    { label: "Total Revenue", value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign },
    { label: "Books Sold", value: uniqueBooks, icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen py-8 px-6" style={{ backgroundColor: "#f6f1ea" }}>

      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: "#053c41" }}>
          Sales History
        </h1>
        <p className="text-sm mt-1" style={{ color: "#053c41", opacity: 0.6 }}>
          Track your ebook sales and revenue
        </p>
      </div>

      {/* Summary stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-2xl p-5 shadow-sm"
              style={{ backgroundColor: "#053c41" }}
            >
              <div className="flex items-center justify-between mb-3">
                <p
                  className="text-xs font-medium uppercase tracking-wider"
                  style={{ color: "#f6f1ea", opacity: 0.7 }}
                >
                  {card.label}
                </p>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "#AE7C54" }}
                >
                  <Icon size={16} className="text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold" style={{ color: "#f6f1ea" }}>
                {card.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Search bar */}
      <div className="relative mb-6 max-w-sm">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: "#053c41", opacity: 0.4 }}
        />
        <input
          type="text"
          placeholder="Search by title or buyer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#AE7C54]/40 transition"
          style={{ borderColor: "#053c41/20", color: "#053c41" }}
        />
      </div>

      {/* Sales table */}
      <div
        className="bg-white rounded-2xl shadow-sm border overflow-hidden"
        style={{ borderColor: "#e5e7eb" }}
      >
        {/* Empty state */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <TrendingUp
              size={40}
              className="mx-auto mb-3"
              style={{ color: "#053c41", opacity: 0.2 }}
            />
            <p className="text-sm" style={{ color: "#053c41", opacity: 0.5 }}>
              No sales found
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">

              {/* Column headers */}
              <thead>
                <tr style={{ backgroundColor: "#f6f1ea" }}>
                  {["#", "Ebook Title", "Buyer", "Buyer Email", "Amount", "Date"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "#053c41", opacity: 0.6 }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filtered.map((sale, index) => (
                  <tr
                    key={sale._id}
                    className="border-t hover:bg-[#f6f1ea]/50 transition"
                    style={{ borderColor: "#e5e7eb" }}
                  >
                    {/* Row number */}
                    <td
                      className="px-6 py-4 text-xs"
                      style={{ color: "#053c41", opacity: 0.4 }}
                    >
                      {index + 1}
                    </td>

                    {/* Ebook title */}
                    <td
                      className="px-6 py-4 font-medium"
                      style={{ color: "#053c41" }}
                    >
                      {sale.ebookTitle}
                    </td>

                    {/* Buyer name */}
                    <td
                      className="px-6 py-4"
                      style={{ color: "#053c41", opacity: 0.8 }}
                    >
                      {sale.buyerName}
                    </td>

                    {/* Buyer email */}
                    <td
                      className="px-6 py-4 text-xs"
                      style={{ color: "#053c41", opacity: 0.6 }}
                    >
                      {sale.buyerEmail}
                    </td>

                    {/* Sale amount */}
                    <td
                      className="px-6 py-4 font-semibold"
                      style={{ color: "#AE7C54" }}
                    >
                      ${sale.amount.toFixed(2)}
                    </td>

                    {/* Purchase date */}
                    <td
                      className="px-6 py-4 text-xs"
                      style={{ color: "#053c41", opacity: 0.6 }}
                    >
                      {new Date(sale.purchaseDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}