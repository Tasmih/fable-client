"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  House,
  BookOpen,
  Person,
  Plus,
  Power,
  CreditCard,
  Persons,
  SquareChartBar,
  Bookmark,
  Receipt,
  ShieldCheck,
} from "@gravity-ui/icons";

import { signOut, useSession } from "@/lib/auth-client";

const DEFAULT_ROUTES = {
  user: "/dashboard/user",
  writer: "/dashboard/writer",
  admin: "/dashboard/admin",
};

export default function DashboardSidebar({ user }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const [imageError, setImageError] = useState(false);

  const sessionUser = session?.user || {};

  const mergedUser = {
    ...user,
    ...sessionUser,
  };

  const actualRole = mergedUser?.role || "user";
  const role = actualRole;
  const logoSrc = "/logo.png";

  const avatarUrl = !imageError ? mergedUser?.image : null;
  const userName = mergedUser?.name || "Reader";
  const userEmail = mergedUser?.email || "reader@fable.com";

  const menu = {
    user: [
      {
        name: "Overview",
        icon: House,
        href: "/dashboard/user",
      },
      {
        name: "Purchased Books",
        icon: BookOpen,
        href: "/dashboard/user/purchasedBooks",
      },
      {
        name: "Purchase History",
        icon: CreditCard,
        href: "/dashboard/user/purchaseHistory",
      },
      {
        name: "Bookmarks",
        icon: Bookmark,
        href: "/dashboard/user/bookmarks",
      },
      {
        name: "Profile",
        icon: Person,
        href: "/dashboard/user/profile",
      },
      {
        name: "Update Profile",
        icon: Person,
        href: "/dashboard/user/updateProfile",
      },
    ],

    writer: [
      {
        name: "Overview",
        icon: House,
        href: "/dashboard/writer",
      },
      {
        name: "Manage Ebooks",
        icon: BookOpen,
        href: "/dashboard/writer/manageEbooks",
      },
      {
        name: "Add Ebook",
        icon: Plus,
        href: "/dashboard/writer/addEbook",
      },
      {
        name: "Bookmarks",
        icon: Bookmark,
        href: "/dashboard/writer/bookmarks",
      },
      {
        name: "Purchased Books",
        icon: BookOpen,
        href: "/dashboard/writer/purchasedBooks",
      },
      {
        name: "Purchase History",
        icon: CreditCard,
        href: "/dashboard/writer/purchaseHistory",
      },
      {
        name: "Sales History",
        icon: Receipt,
        href: "/dashboard/writer/salesHistory",
      },
      {
        name: "Profile",
        icon: Person,
        href: "/dashboard/writer/profile",
      },
      {
        name: "Update Profile",
        icon: Person,
        href: "/dashboard/writer/updateProfile",
      },
      {
        name: "Writer Verification",
        icon: ShieldCheck,
        href: "/dashboard/writer/verify",
      },
    ],

    admin: [
      {
        name: "Dashboard",
        icon: House,
        href: "/dashboard/admin",
      },
      {
        name: "Users",
        icon: Persons,
        href: "/dashboard/admin/users",
      },
      {
        name: "Ebooks",
        icon: BookOpen,
        href: "/dashboard/admin/ebooks",
      },
      {
        name: "Transactions",
        icon: CreditCard,
        href: "/dashboard/admin/transactions",
      },
      {
        name: "Analytics",
        icon: SquareChartBar,
        href: "/dashboard/admin/analytics",
      },
      {
        name: "Profile",
        icon: Person,
        href: "/dashboard/admin/profile",
      },
      {
        name: "Update Profile",
        icon: Person,
        href: "/dashboard/admin/updateProfile",
      },
    ],
  };

  const items = menu[role] || menu.user;
  const roleHome = DEFAULT_ROUTES[role] || "/dashboard/user";

  const handleLogout = async () => {
    await signOut();
    router.push("/auth/signin");
  };

  return (
    <aside className="flex h-screen w-72 shrink-0 flex-col border-r border-[#AE7C54]/20 bg-[#053c41] text-[#f6f1ea] antialiased">
      <div className="border-b border-[#AE7C54]/20 p-5">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="min-w-0 transition-opacity hover:opacity-90">
            {logoSrc ? (
              <img
                src={logoSrc}
                alt="Fable Logo"
                className="max-h-16 w-16 rounded-xl object-contain shadow-inner"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div>
                <h1 className="text-xl font-black tracking-wider text-white">
                  FABLE
                </h1>
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#FCB886]">
                  Ebook Hub
                </p>
              </div>
            )}
          </Link>

          <Link
            href="/"
            title="Go to Home"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-[#FCB886]/35 bg-[#FCB886]/10 px-3.5 py-2 text-xs font-black uppercase tracking-wider text-[#f6f1ea] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#AE7C54] hover:text-white hover:shadow-lg hover:shadow-black/10 active:translate-y-0"
          >
            <House className="h-4 w-4 shrink-0" />
            <span>Home</span>
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-3.5 border-b border-[#AE7C54]/20 bg-[#031f22]/20 p-5">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={userName}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="h-11 w-11 shrink-0 rounded-full border-2 border-[#FCB886]/50 bg-[#f6f1ea] object-cover shadow-md transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#AE7C54] text-base font-black text-white shadow-md transition-transform duration-300 hover:scale-105">
            {userName?.[0]?.toUpperCase() || "U"}
          </div>
        )}

        <div className="min-w-0">
          <p className="truncate text-sm font-black text-white">{userName}</p>
          <p className="truncate text-xs font-medium text-[#f6f1ea]/65">
            {userEmail}
          </p>
          <p className="mt-1 inline-block rounded bg-[#FCB886]/15 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#FCB886]">
            {role}
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3.5 py-4 scrollbar-thin scrollbar-thumb-[#AE7C54]/30">
        {items.map((item) => {
          const Icon = item.icon;

          const isEditEbookPage =
            item.href === "/dashboard/writer/manageEbooks" &&
            pathname.startsWith("/dashboard/writer/editEbook");

          const active =
            pathname === item.href ||
            (item.href !== roleHome && pathname.startsWith(`${item.href}/`)) ||
            isEditEbookPage;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3.5 rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-wide transition-all duration-300 ${
                active
                  ? "bg-[#AE7C54] text-white shadow-md shadow-black/15 translate-x-1"
                  : "text-[#f6f1ea]/85 hover:bg-[#031f22]/45 hover:text-white hover:translate-x-0.5"
              }`}
            >
              <Icon
                className={`h-4 w-4 shrink-0 transition-transform duration-300 ${
                  active ? "scale-105 text-[#FCB886]" : "text-[#f6f1ea]/60"
                }`}
              />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[#AE7C54]/20 p-4 bg-[#031f22]/10">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#894329] px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#AE7C54] hover:shadow-xl hover:shadow-black/15 active:translate-y-0"
        >
          <Power className="h-4 w-4 shrink-0 text-white" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}