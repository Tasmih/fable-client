"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import DashboardSideBar from "@/components/dashboard/DashboardSidebar";
import { useSession } from "@/lib/auth-client";

export default function DashboardLayout({ children }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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
    <div className="flex min-h-screen w-full max-w-full overflow-x-hidden bg-[#053c41]">
      <aside className="sticky top-0 h-screen shrink-0 bg-[#053c41]">
        <DashboardSideBar user={session?.user} />
      </aside>

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
        <p className="mt-4 text-sm font-bold text-[#053c41]">{message}</p>
      </div>
    </div>
  );
}