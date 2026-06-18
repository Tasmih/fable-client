"use client";

import { useSession } from "@/lib/auth-client";

export default function WriterDashboard() {
  const { data: session } = useSession();

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">
        Writer Dashboard
      </h1>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-4">

        <div className="p-4 bg-white border rounded-xl">
          Total Books
        </div>

        <div className="p-4 bg-white border rounded-xl">
          Published
        </div>

        <div className="p-4 bg-white border rounded-xl">
          Sales
        </div>

        <div className="p-4 bg-white border rounded-xl">
          Revenue
        </div>

      </div>

      {/* ACTIONS */}
      <div className="flex gap-3">
        <button className="px-4 py-2 bg-teal-600 text-white rounded-lg">
          Add Ebook
        </button>

        <button className="px-4 py-2 border rounded-lg">
          Manage Books
        </button>
      </div>

      {/* TABLE */}
      <div className="p-6 bg-white border rounded-xl">
        <h2 className="font-semibold mb-4">My Books</h2>
        <p className="text-gray-500">CRUD table will come here</p>
      </div>

    </div>
  );
}