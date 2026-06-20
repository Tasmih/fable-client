"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  House,
  BookOpen,
  Person,
  Plus,
  Power,
  FileText,
  CreditCard,
  Persons,
  SquareChartBar,
} from "@gravity-ui/icons";
import { signOut, useSession } from "@/lib/auth-client";
import { useState } from "react";

const IS_DEV = process.env.NODE_ENV === "development";

const DEFAULT_ROUTES = {
  user: "/dashboard/user",
  writer: "/dashboard/writer",
  admin: "/dashboard/admin",
};

export default function DashboardSidebar({ user }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const [devRole, setDevRole] = useState(null);
  const [imageError, setImageError] = useState(false);

  const sessionUser = session?.user || {};
  const mergedUser = {
    ...user,
    ...sessionUser,
  };

  const actualRole = mergedUser?.role || "user";
  const role = IS_DEV && devRole ? devRole : actualRole;

  const avatarUrl = !imageError ? mergedUser?.image : null;
  const userName = mergedUser?.name || "Reader";
  const userEmail = mergedUser?.email || "reader@fable.com";

  const menu = {
    user: [
  { name: "Overview", icon: House, href: "/dashboard/user" },
  { name: "Purchased Books", icon: BookOpen, href: "/dashboard/user/purchasedBooks" },
  { name: "Purchase History", icon: CreditCard, href: "/dashboard/user/purchaseHistory" },
  { name: "Bookmarks", icon: FileText, href: "/dashboard/user/bookmarks" },
  { name: "Profile", icon: Person, href: "/dashboard/user/profile" },
  { name: "Update Profile", icon: Person, href: "/dashboard/user/updateProfile" },
],

    writer: [
      {
        name: "Dashboard",
        icon: SquareChartBar,
        href: "/dashboard/writer",
      },
      {
        name: "My Books",
        icon: BookOpen,
        href: "/dashboard/writer/books",
      },
      {
        name: "Add Ebook",
        icon: Plus,
        href: "/dashboard/writer/add-ebook",
      },
      {
        name: "Sales History",
        icon: CreditCard,
        href: "/dashboard/writer/sales",
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
    ],
  };

  const items = menu[role] || [];

  const handleLogout = async () => {
    await signOut();
    router.push("/auth/signin");
  };

  return (
    <aside className="flex h-screen w-72 flex-col border-r border-[#AE7C54]/20 bg-[#053c41] text-[#f6f1ea]">
      {/* logo */}
      <div className="border-b border-[#AE7C54]/20 p-5">
        <Link href="/" className="inline-block">
          <h1 className="text-xl font-bold tracking-wide">FABLE</h1>
          <p className="text-xs text-[#f6f1ea]/70">Ebook Sharing Platform</p>
        </Link>
      </div>

      {/* dev role switcher */}
      {IS_DEV && (
        <div className="border-b border-yellow-400/30 bg-yellow-500/20 px-4 py-2">
          <p className="mb-1 text-xs text-yellow-300">🛠 dev: role preview</p>

          <div className="flex gap-1">
            {["user", "writer", "admin"].map((r) => (
              <button
                key={r}
                onClick={() => {
                  setDevRole(r === actualRole ? null : r);
                  router.push(DEFAULT_ROUTES[r]);
                }}
                className={`rounded px-2 py-1 text-xs capitalize transition ${
                  role === r
                    ? "bg-yellow-400 font-bold text-black"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* user info */}
      <div className="flex items-center gap-3 border-b border-[#AE7C54]/20 p-5">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={userName}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="h-12 w-12 shrink-0 rounded-full border-2 border-[#AE7C54]/60 bg-[#f6f1ea] object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#AE7C54] text-lg font-bold text-white">
            {userName?.[0]?.toUpperCase() || "U"}
          </div>
        )}

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{userName}</p>

          <p className="truncate text-xs text-[#f6f1ea]/70">{userEmail}</p>

          <p className="mt-1 text-xs uppercase tracking-wide text-[#AE7C54]">
            {role}
          </p>
        </div>
      </div>

      {/* menu */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {items.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href ||
            (item.href !== "/dashboard/user" &&
              pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-[#AE7C54] text-white shadow-sm"
                  : "text-[#f6f1ea] hover:bg-[#0b4f57]"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* logout */}
      <div className="border-t border-[#AE7C54]/20 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-red-200 transition hover:bg-red-500/10 hover:text-red-100"
        >
          <Power className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}