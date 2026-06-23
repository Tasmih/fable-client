"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  BookOpen,
  CheckCircle,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  X,
  XCircle,
} from "lucide-react";
import { Person } from "@gravity-ui/icons";
import { signOut, useSession } from "@/lib/auth-client";

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [profileImageError, setProfileImageError] = useState(false);

  const { data: session, isPending } = useSession();
  const user = session?.user;

  const pathname = usePathname();
  const router = useRouter();
  const mobileRef = useRef(null);

  const logoSrc = "/logo.png";
  const userName = user?.name || "Reader";
  const userImageSrc = user?.image && !profileImageError ? user.image : "";

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 4);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (mobileRef.current && !mobileRef.current.contains(event.target)) {
        setMobileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        icon: <CheckCircle className="h-4 w-4 text-white" />,
      });

      setMobileOpen(false);
      router.push("/");
      router.refresh();
    } catch (err) {
      toast.error("Logout failed. Please try again.", {
        icon: <XCircle className="h-4 w-4 text-red-500" />,
      });
    }
  };

  const navbarClass = !mounted
    ? "sticky top-0 z-50 w-full border-b border-[#AE7C54]/20 bg-[#010f11]"
    : `sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        isScrolled
          ? "border-[#AE7C54]/25 bg-[#010f11]/95 shadow-xl shadow-black/30 backdrop-blur-xl"
          : "border-[#AE7C54]/20 bg-gradient-to-r from-[#010f11] via-[#02191c] to-[#03282d]"
      }`;

  const navLinkClass = (path) =>
    `group relative inline-flex items-center gap-2 px-2 py-2 text-sm font-bold transition ${
      isActive(path) ? "text-white" : "text-[#f6f1ea]/75 hover:text-white"
    }`;

  const mobileLinkClass = (path) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${
      isActive(path)
        ? "bg-[#AE7C54] text-white"
        : "text-[#f6f1ea]/85 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <nav className={navbarClass}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        
        <Link
          href="/"
          className="group flex items-center gap-4 rounded-2xl border border-[#AE7C54]/15 bg-white/[0.04] p-2 pr-5 shadow-inner shadow-black/20 transition hover:border-[#AE7C54]/30 hover:bg-white/[0.06]"
        >
          {!logoError ? (
            <img
              src={logoSrc}
              alt="Fable Logo"
              className="h-[56px] w-[56px] shrink-0 rounded-xl border border-[#AE7C54]/35 bg-[#f6f1ea] object-contain p-1 shadow-lg shadow-black/35 transition duration-300 group-hover:scale-105"
              onError={() => setLogoError(true)}
            />
          ) : (
            <div className="flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-xl border border-[#AE7C54]/35 bg-[#f6f1ea] text-[#AE7C54] shadow-lg shadow-black/35">
              <BookOpen className="h-6 w-6" />
            </div>
          )}

          <div className="flex flex-col justify-center leading-none">
            <span className="text-lg font-black tracking-tight text-white font-serif">
              Fable
            </span>
            <span className="mt-1 text-[10px] font-bold uppercase tracking-widest text-[#f6f1ea]/40">
              Ebook Hub
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <div className="flex items-center gap-7 rounded-2xl border border-[#AE7C54]/15 bg-white/[0.03] px-5 py-2.5 shadow-inner shadow-black/20">
            <Link href="/" className={navLinkClass("/")}>
              <Home size={16} />
              Home
              <span
                className={`absolute -bottom-1 left-0 h-[2px] rounded-full bg-[#AE7C54] transition-all duration-300 ${
                  isActive("/") ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </Link>

            <Link href="/ebooks" className={navLinkClass("/ebooks")}>
              <Search size={16} />
              Browse Ebooks
              <span
                className={`absolute -bottom-1 left-0 h-[2px] rounded-full bg-[#AE7C54] transition-all duration-300 ${
                  isActive("/ebooks") ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </Link>

            <Link
              href={getDashboardHref()}
              className={navLinkClass("/dashboard")}
            >
              <LayoutDashboard size={16} />
              Dashboard
              <span
                className={`absolute -bottom-1 left-0 h-[2px] rounded-full bg-[#AE7C54] transition-all duration-300 ${
                  isActive("/dashboard") ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </Link>
          </div>

          <div className="h-7 w-px bg-[#AE7C54]/25" />

          <div className="flex items-center gap-3">
            {isPending ? (
              <div className="h-11 w-36 animate-pulse rounded-2xl border border-[#AE7C54]/15 bg-white/[0.04]" />
            ) : !user ? (
              <>
                <Link
                  href="/auth/signin"
                  className="rounded-xl px-4 py-2 text-sm font-bold text-[#f6f1ea]/85 transition hover:bg-white/10 hover:text-white"
                >
                  Login
                </Link>

                <Link
                  href="/auth/signup"
                  className="rounded-xl bg-[#AE7C54] px-5 py-2.5 text-sm font-black text-white shadow-md shadow-black/10 transition hover:bg-[#c99367]"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3 rounded-2xl border border-[#AE7C54]/15 bg-white/[0.04] px-3 py-1.5 shadow-inner shadow-black/20">
                <div className="hidden text-right lg:block leading-tight">
                  <p className="text-[10px] font-semibold text-[#f6f1ea]/45">Hello,</p>
                  <p className="max-w-[120px] truncate text-xs font-black text-white">{userName}</p>
                </div>

                {userImageSrc ? (
                  <img
                    src={userImageSrc}
                    alt={userName}
                    referrerPolicy="no-referrer"
                    onError={() => setProfileImageError(true)}
                    className="h-9 w-9 rounded-full border-2 border-[#AE7C54]/70 bg-[#f6f1ea] object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#AE7C54] text-white">
                    <Person className="h-4 w-4" />
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 rounded-xl border border-[#AE7C54]/25 bg-[#AE7C54]/10 px-3 py-1.5 text-xs font-bold text-[#f6f1ea] transition hover:bg-[#AE7C54] hover:text-white"
                >
                  <LogOut size={13} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#AE7C54]/25 bg-white/5 text-white transition hover:bg-white/10 md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div
          ref={mobileRef}
          className="border-t border-[#AE7C54]/20 bg-[#010f11] px-4 py-5 shadow-xl shadow-black/30 md:hidden space-y-4"
        >
          {user && (
            <div className="flex items-center gap-3 rounded-2xl border border-[#AE7C54]/20 bg-white/[0.04] p-3">
              {userImageSrc ? (
                <img
                  src={userImageSrc}
                  alt={userName}
                  referrerPolicy="no-referrer"
                  onError={() => setProfileImageError(true)}
                  className="h-11 w-11 rounded-full border-2 border-[#AE7C54]/70 bg-[#f6f1ea] object-cover"
                />
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#AE7C54] text-white">
                  <Person className="h-4 w-4" />
                </div>
              )}

              <div className="min-w-0 leading-tight">
                <p className="text-[10px] font-semibold text-[#f6f1ea]/55">Hello,</p>
                <p className="truncate text-sm font-black text-white">{userName}</p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Link href="/" className={mobileLinkClass("/")}>
              <Home size={16} />
              Home
            </Link>

            <Link href="/ebooks" className={mobileLinkClass("/ebooks")}>
              <Search size={16} />
              Browse Ebooks
            </Link>

            <Link href={getDashboardHref()} className={mobileLinkClass("/dashboard")}>
              <LayoutDashboard size={16} />
              Dashboard
            </Link>
          </div>

          {!user ? (
            <div className="grid grid-cols-2 gap-3 border-t border-[#AE7C54]/15 pt-4">
              <Link
                href="/auth/signin"
                className="rounded-xl border border-[#AE7C54]/25 py-2.5 text-center text-sm font-bold text-white transition hover:bg-white/10"
              >
                Login
              </Link> birthday

              <Link
                href="/auth/signup"
                className="rounded-xl bg-[#AE7C54] py-2.5 text-center text-sm font-black text-white transition hover:bg-[#c99367]"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#AE7C54]/20 bg-[#AE7C54]/10 py-2.5 text-sm font-bold text-white transition hover:bg-[#AE7C54]"
            >
              <LogOut size={15} />
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}