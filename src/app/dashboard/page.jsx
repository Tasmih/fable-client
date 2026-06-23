"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

export default function DashboardRedirectPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.replace("/unauthorized");
      return;
    }

    const role = session.user.role || "user";

    if (role === "admin") {
      router.replace("/dashboard/admin");
      return;
    }

    if (role === "writer") {
      router.replace("/dashboard/writer");
      return;
    }

    router.replace("/dashboard/user");
  }, [session, isPending, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6f1ea]">
      <div className="text-center">
        <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-[#AE7C54] border-t-transparent" />
        <p className="mt-4 text-sm font-bold text-[#053c41]">
          Opening your dashboard...
        </p>
      </div>
    </main>
  );
}