"use client";

import { useEffect, useState } from "react";
import DashboardSideBar from "@/components/dashboard/DashboardSidebar";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

// Dashboard Layout
export default function DashboardLayout({ children }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  // Browser mount check
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Protect dashboard routes
  useEffect(() => {
    if (isClient && !isPending && !session) {
      router.replace("/auth/signin");
    }
  }, [session, isPending, router, isClient]);

  // Loading spinner
  if (!isClient || isPending) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#f6f1ea]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#AE7C54] border-t-transparent" />
      </div>
    );
  }

  // If no session, redirect already handled
  if (!session) return null;

  return (
    <div className="flex min-h-screen w-full max-w-full overflow-x-hidden bg-[#053c41]">
      {/* Left Sidebar Area */}
      <aside className="sticky top-0 h-screen shrink-0 bg-[#053c41]">
        <DashboardSideBar user={session?.user} />
      </aside>

      {/* Main Dashboard Content Area */}
      <div className="min-w-0 flex-1 overflow-x-hidden bg-[#f6f1ea]">
        <main className="min-w-0 overflow-x-hidden p-4 md:p-6">
          <div className="mx-auto w-full max-w-[1400px] overflow-x-hidden">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}