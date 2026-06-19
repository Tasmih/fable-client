"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  BookOpen,
  Menu,
  X,
  Home,
  Search,
  LayoutDashboard,
  User,
  LogOut,
  XCircle,
  CheckCircle,
} from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const pathname = usePathname();
  const router = useRouter();
  const mobileRef = useRef(null);

  // 1. Safe Client Mounting Tracker
  useEffect(() => {
    setMounted(true);

    // 2. Window Scroll Event Listener
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 3. Handle Outside Clicks for Mobile Menu
  useEffect(() => {
    function handleClickOutside(e) {
      if (mobileRef.current && !mobileRef.current.contains(e.target)) {
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 4. Close Mobile Menu on Route Change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (path) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  const getDashboardHref = () => {
    if (!user) return "/dashboard";
    if (user.role === "admin") return "/dashboard/admin";
    if (user.role === "writer") return "/dashboard/writer";
    return "/dashboard/user";
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully", {
        icon: <CheckCircle className="w-4 h-4 text-green-500" />,
      });
      setMobileOpen(false);
      router.push("/");
      router.refresh();
    } catch (err) {
      toast.error("Logout failed. Please try again.", {
        icon: <XCircle className="w-4 h-4 text-red-500" />,
      });
    }
  };

  // 🎯 Dynamic Hydration Mismatch Guard
  const navbarClass = !mounted 
    ? "sticky top-0 z-50 w-full border-b border-[#AE7C54]/10 bg-[#053c41]/95" 
    : `sticky top-0 z-50 w-full border-b border-[#AE7C54]/10 transition-all duration-300 ${
        isScrolled ? "bg-[#053c41]/95 shadow-md" : "bg-[#0f6f7a]/10 backdrop-blur-md"
      }`;

  return (
    <nav className={navbarClass}>
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        {/* LEFT - Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-[#AE7C54] rounded-lg flex items-center justify-center">
            <BookOpen className="text-white w-5 h-5" />
          </div>
          <span className="text-[#f6f1ea] font-bold text-lg font-serif">
            Fable
          </span>
        </Link>

        {/* RIGHT - Nav + Divider + Auth */}
        <div className="hidden md:flex items-center gap-6">

          {/* Nav Links */}
          <div className="flex gap-10 text-sm font-medium">
            <Link href="/" className="relative group text-[#f6f1ea]">
              <Home size={16} className="inline mr-1" />
              Home
              <span className={`absolute left-0 -bottom-1 h-[2px] bg-[#AE7C54] transition-all duration-300 ${isActive("/") ? "w-full" : "w-0 group-hover:w-full"}`} />
            </Link>

            <Link href="/ebooks" className="relative group text-[#f6f1ea]">
              <Search size={16} className="inline mr-1" />
              Browse Ebooks
              <span className={`absolute left-0 -bottom-1 h-[2px] bg-[#AE7C54] transition-all duration-300 ${isActive("/ebooks") ? "w-full" : "w-0 group-hover:w-full"}`} />
            </Link>

            {user && (
              <Link href={getDashboardHref()} className="relative group text-[#f6f1ea]">
                <LayoutDashboard size={16} className="inline mr-1" />
                Dashboard
                <span className={`absolute left-0 -bottom-1 h-[2px] bg-[#AE7C54] transition-all duration-300 ${isActive("/dashboard") ? "w-full" : "w-0 group-hover:w-full"}`} />
              </Link>
            )}
          </div>

          {/* Vertical Divider */}
          <div className="h-6 w-px bg-[#AE7C54]/40" />

          {/* Auth */}
          <div className="flex items-center gap-3">
            {isPending ? (
              <div className="h-9 w-24 rounded-lg bg-[#AE7C54]/20 animate-pulse" />
            ) : !user ? (
              <>
                <Link
                  href="/auth/signin"
                  className="text-[#f6f1ea] text-sm hover:text-[#e8a95c] transition"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 text-sm rounded-lg bg-[#AE7C54] text-white hover:bg-[#e8a95c] transition"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#AE7C54] flex items-center justify-center text-white font-semibold text-sm">
                  {user.name?.[0]?.toUpperCase() || <User size={16} />}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-red-300 text-sm hover:text-red-200 transition"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-[#f6f1ea]"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div
          ref={mobileRef}
          className="md:hidden bg-[#0f6f7a] border-t border-[#AE7C54]/30 px-6 py-4 flex flex-col gap-4"
        >
          <Link href="/" className={`flex gap-2 items-center text-sm ${isActive("/") ? "text-[#AE7C54] font-semibold" : "text-[#f6f1ea]"}`}>
            <Home size={16} /> Home
          </Link>

          <Link href="/ebooks" className={`flex gap-2 items-center text-sm ${isActive("/ebooks") ? "text-[#AE7C54] font-semibold" : "text-[#f6f1ea]"}`}>
            <Search size={16} /> Browse Ebooks
          </Link>

          {user && (
            <Link href={getDashboardHref()} className={`flex gap-2 items-center text-sm ${isActive("/dashboard") ? "text-[#AE7C54] font-semibold" : "text-[#f6f1ea]"}`}>
              <LayoutDashboard size={16} /> Dashboard
            </Link>
          )}

          {!user && (
            <div className="flex flex-col gap-2 pt-3 border-t border-[#AE7C54]/20">
              <Link
                href="/auth/signin"
                className="text-center py-2 border border-[#AE7C54]/30 text-[#f6f1ea] rounded-lg text-sm"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="text-center py-2 bg-[#AE7C54] text-white rounded-lg text-sm"
              >
                Sign Up
              </Link>
            </div>
          )}

          {user && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-300 text-sm hover:text-red-200 transition"
            >
              <LogOut size={14} /> Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}