"use client";

import { useSession } from "@/lib/auth-client";

export default function UserDashboard() {
  const { data: session } = useSession();

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">
        User Dashboard
      </h1>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4">

        <div className="p-4 bg-white rounded-xl border">
          Purchased Books
        </div>

        <div className="p-4 bg-white rounded-xl border">
          Total Spent
        </div>

        <div className="p-4 bg-white rounded-xl border">
          Bookmarks
        </div>

      </div>

      {/* PURCHASED BOOKS */}
      <div className="p-6 bg-white border rounded-xl">
        <h2 className="font-semibold mb-4">My Purchased Books</h2>
        <p className="text-gray-500">List of ebooks will come here</p>
      </div>

    </div>
  );
}