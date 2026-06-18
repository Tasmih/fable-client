"use client";

import DashboardSideBar from "@/components/dashboard/DashboardSidebar";
import Topbar from "@/components/dashboard/TopBar";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Dashboard Layout (Protected + Role based UI wrapper)
export default function DashboardLayout({ children }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

//   // 🔐 Protect dashboard routes
//   useEffect(() => {
//     if (!isPending && !session) {
//       router.replace("/auth/signin");
//     }
//   }, [session, isPending, router]);

  // ⏳ Loading state
  if (isPending) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="h-10 w-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  //  No session fallback
  //if (!session) return null;

  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      <DashboardSideBar user={session?.user} />

      {/* Main Content */}
      <div className="flex flex-col flex-1">

        {/* Topbar */}
        <Topbar user={session?.user} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}