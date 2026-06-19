"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  House, BookOpen, Person, Plus, Power,
  FileText, CreditCard, Persons, Database, SquareChartBar,
} from "@gravity-ui/icons";
import { signOut } from "@/lib/auth-client";
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

  const actualRole = user?.role;
  const [devRole, setDevRole] = useState(null);

  const role = (IS_DEV && devRole) ? devRole : actualRole;

  const menu = {
    user: [
      { name: "Overview", icon: House, href: "/dashboard/user" },
      { name: "Books", icon: BookOpen, href: "/dashboard/user/books" },
      { name: "Bookmarks", icon: FileText, href: "/dashboard/user/bookmarks" },
      { name: "Profile", icon: Person, href: "/dashboard/user/profile" },
    ],
    writer: [
      { name: "Dashboard", icon: SquareChartBar, href: "/dashboard/writer" },
      { name: "My Books", icon: BookOpen, href: "/dashboard/writer/books" },
      { name: "Add Ebook", icon: Plus, href: "/dashboard/writer/add-ebook" },
      { name: "Sales History", icon: CreditCard, href: "/dashboard/writer/sales" },
    ],
    admin: [
      { name: "Dashboard", icon: House, href: "/dashboard/admin" },
      { name: "Users", icon: Persons, href: "/dashboard/admin/users" },
      { name: "Ebooks", icon: BookOpen, href: "/ebooks" },
      { name: "Transactions", icon: CreditCard, href: "/dashboard/admin/transactions" },
      { name: "Analytics", icon: SquareChartBar, href: "/dashboard/admin/analytics" },
    ],
  };

  const items = menu[role] || [];

  const handleLogout = async () => {
    await signOut();
    router.push("/auth/signin");
  };

  return (
    <aside className="w-72 h-screen flex flex-col bg-[#053c41] text-[#f6f1ea] border-r border-[#AE7C54]/20">

      {/* LOGO */}
      <div className="p-5 border-b border-[#AE7C54]/20">
        <h1 className="text-xl font-bold">FABLE</h1>
        <p className="text-xs text-[#f6f1ea]/70">Ebook Sharing Platform</p>
      </div>

      {/* DEV ROLE SWITCHER */}
      {IS_DEV && (
        <div className="px-4 py-2 bg-yellow-500/20 border-b border-yellow-400/30">
          <p className="text-xs text-yellow-300 mb-1">🛠 Dev: Role Preview</p>
          <div className="flex gap-1">
            {["user", "writer", "admin"].map((r) => (
              <button
                key={r}
                onClick={() => {
                  setDevRole(r === actualRole ? null : r);
                  router.push(DEFAULT_ROUTES[r]);
                }}
                className={`text-xs px-2 py-1 rounded capitalize transition ${
                  role === r
                    ? "bg-yellow-400 text-black font-bold"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* USER INFO */}
      <div className="p-5 flex items-center gap-3 border-b border-[#AE7C54]/20">
        <div className="w-10 h-10 rounded-full bg-[#AE7C54] flex items-center justify-center font-bold">
          {user?.name?.[0]?.toUpperCase() || "U"}
        </div>
        <div>
          <p className="text-sm font-semibold">{user?.name}</p>
          <p className="text-xs text-[#f6f1ea]/70 uppercase">{role}</p>
        </div>
      </div>

      {/* MENU */}
      <nav className="flex-1 p-4 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                active
                  ? "bg-[#AE7C54] text-white"
                  : "hover:bg-[#0b4f57] text-[#f6f1ea]"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* LOGOUT */}
      <div className="p-4 border-t border-[#AE7C54]/20">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-200 hover:text-red-100"
        >
          <Power className="w-5 h-5" />
          Logout
        </button>
      </div>

    </aside>
  );
}