"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import DashboardSideBar from "@/components/dashboard/DashboardSidebar";
import { useSession } from "@/lib/auth-client";
import { FiMenu, FiX } from "react-icons/fi"; // Imported icons for the menu

export default function DashboardLayout({ children }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile menu state

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Close mobile menu when the route/pathname changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const userRole = session?.user?.role || "user";

  const requiredRole = useMemo(() => {
    if (pathname?.startsWith("/dashboard/admin")) return "admin";
    if (pathname?.startsWith("/dashboard/writer")) return "writer";
    if (pathname?.startsWith("/dashboard/user")) return "user";
    return null;
  }, [pathname]);

  const isWrongRole =
    Boolean(requiredRole) && Boolean(session) && userRole !== requiredRole;

  useEffect(() => {
    if (!isClient || isPending) return;

    if (!session) {
      router.replace("/unauthorized");
      return;
    }

    if (isWrongRole) {
      router.replace("/forbidden");
    }
  }, [isClient, isPending, session, isWrongRole, router]);

  if (!isClient || isPending) {
    return <DashboardLoading message="Checking dashboard access..." />;
  }

  if (!session) {
    return null;
  }

  if (isWrongRole) {
    return <DashboardLoading message="Redirecting to forbidden page..." />;
  }

  return (
    <div className="relative min-h-screen w-full bg-[#f6f1ea] md:flex overflow-x-hidden">
      
      {/* 1. Mobile Top Bar: Visible only on mobile screens (md:hidden) */}
      <div className="flex w-full items-center justify-between bg-[#053c41] p-4 text-white md:hidden sticky top-0 z-40 shadow-md">
        <span className="font-bold tracking-wide">Fabel Dashboard</span>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="text-2xl focus:outline-none transition-transform duration-300 hover:scale-110 active:scale-90"
        >
          {isMobileMenuOpen ? <FiX className="animate-in spin-in-90 duration-200" /> : <FiMenu className="animate-in fade-in duration-200" />}
        </button>
      </div>

      {/* 2. Sidebar Drawer: Smooth slide-in motion for mobile view */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-[#053c41] transition-transform duration-300 ease-in-out md:sticky md:top-0 md:h-screen md:w-auto md:translate-x-0 md:shrink-0
          ${isMobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}`}
      >
        <DashboardSideBar user={session?.user} />
      </aside>

      {/* Smooth backdrop overlay with fade effect when mobile menu is active */}
      <div 
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* 3. Main Content Area */}
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

function DashboardLoading({ message }) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#f6f1ea]">
      <div className="text-center">
        <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-[#AE7C54] border-t-transparent" />
        <p className="mt-4 text-sm font-bold text-[#053c41] tracking-wide">{message}</p>
      </div>
    </div>
  );
}