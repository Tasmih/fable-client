"use client";

import { useSession } from "@/lib/auth-client";

export default function AdminDashboard() {
  const { data: session } = useSession();

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">
        Admin Dashboard
      </h1>

      {/* ANALYTICS */}
      <div className="grid grid-cols-4 gap-4">

        <div className="p-4 bg-white border rounded-xl">
          Users
        </div>

        <div className="p-4 bg-white border rounded-xl">
          Writers
        </div>

        <div className="p-4 bg-white border rounded-xl">
          Total Books
        </div>

        <div className="p-4 bg-white border rounded-xl">
          Revenue
        </div>

      </div>

      {/* MANAGEMENT */}
      <div className="grid grid-cols-2 gap-4">

        <div className="p-6 bg-white border rounded-xl">
          <h2 className="font-semibold">Manage Users</h2>
          <p className="text-gray-500">Table here</p>
        </div>

        <div className="p-6 bg-white border rounded-xl">
          <h2 className="font-semibold">Manage Books</h2>
          <p className="text-gray-500">Table here</p>
        </div>

      </div>

    </div>
  );
}