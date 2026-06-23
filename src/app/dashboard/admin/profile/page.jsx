"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useSession } from "@/lib/auth-client";
import { getUserProfile } from "@/lib/actions/users";
import {
  ArrowLeft,
  BarChart3,
  Edit,
  Loader2,
  Mail,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";

export default function AdminProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const userEmail = session?.user?.email || "";

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/unauthorized");
    }
  }, [isPending, session?.user, router]);

  useEffect(() => {
    if (isPending) return;

    const loadProfile = async () => {
      if (!userEmail) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const profileData = await getUserProfile(userEmail).catch(() => null);
        const finalProfile = profileData || session?.user || {};

        setProfile(finalProfile);
      } catch (err) {
        toast.error(err.message || "Failed to load admin profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [isPending, userEmail, session?.user]);

  if (isPending || loading) {
    return (
      <main className="min-h-screen bg-[#f6f1ea]/50 px-4 py-6 md:px-8">
        <section className="mx-auto max-w-5xl rounded-3xl bg-white p-10 text-center shadow-sm">
          <Loader2 size={34} className="mx-auto animate-spin text-[#AE7C54]" />

          <p className="mt-3 text-sm font-semibold text-[#053c41]">
            Loading admin profile...
          </p>
        </section>
      </main>
    );
  }

  if (!session?.user) {
    return null;
  }

  const profileName = profile?.name || session?.user?.name || "Admin";
  const profileEmail = profile?.email || session?.user?.email || "";
  const profileImage = profile?.image || session?.user?.image || "";
  const profileRole = profile?.role || session?.user?.role || "admin";

  return (
    <main className="min-h-screen bg-[#f6f1ea]/50 px-4 py-6 md:px-8">
      <section className="mx-auto max-w-5xl">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/dashboard/admin"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#053c41]/20 bg-white px-4 py-3 text-sm font-semibold text-[#053c41] shadow-sm transition hover:bg-[#053c41] hover:text-white"
          >
            <ArrowLeft size={16} />
            Back Dashboard
          </Link>

          <Link
            href="/dashboard/admin/updateProfile"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#AE7C54] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#c99367]"
          >
            <Edit size={16} />
            Update Profile
          </Link>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#f6f1ea] px-4 py-2 text-sm font-semibold text-[#AE7C54]">
            <ShieldCheck size={16} />
            Admin Profile
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
            <div className="rounded-3xl bg-[#f6f1ea] p-6 text-center">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt={profileName}
                  referrerPolicy="no-referrer"
                  className="mx-auto h-40 w-40 rounded-full border-4 border-[#AE7C54]/30 object-cover"
                />
              ) : (
                <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full bg-[#AE7C54] text-5xl font-bold text-white">
                  {profileName.charAt(0).toUpperCase()}
                </div>
              )}

              <h1 className="mt-5 text-2xl font-bold text-[#053c41]">
                {profileName}
              </h1>

              <p className="mt-1 break-all text-sm text-[#053c41]/70">
                {profileEmail}
              </p>

              <div className="mt-4 flex justify-center">
                <span className="rounded-full bg-white px-4 py-2 text-xs font-bold uppercase text-[#AE7C54]">
                  {profileRole}
                </span>
              </div>
            </div>

            <div className="space-y-5">
              <InfoCard
                icon={<UserRound size={18} />}
                label="Full Name"
                value={profileName}
              />

              <InfoCard
                icon={<Mail size={18} />}
                label="Email Address"
                value={profileEmail}
              />

              <InfoCard
                icon={<ShieldCheck size={18} />}
                label="Role"
                value={profileRole}
                capitalize
              />

              <div className="rounded-2xl border border-[#053c41]/10 bg-[#f6f1ea]/70 p-5">
                <div className="flex items-start gap-3">
                  <ShieldCheck size={20} className="mt-1 text-[#AE7C54]" />

                  <div>
                    <h2 className="text-sm font-bold text-[#053c41]">
                      Admin Account
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-[#053c41]/70">
                      You can manage users, ebooks, transactions, analytics,
                      and platform settings from the admin dashboard.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Link
                  href="/dashboard/admin/users"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#AE7C54] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#c99367]"
                >
                  <Users size={16} />
                  Manage Users
                </Link>

                <Link
                  href="/dashboard/admin/analytics"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#053c41]/20 px-4 py-3 text-sm font-semibold text-[#053c41] transition hover:bg-[#053c41] hover:text-white"
                >
                  <BarChart3 size={16} />
                  Analytics
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function InfoCard({ icon, label, value, capitalize = false }) {
  return (
    <div className="rounded-2xl border border-[#053c41]/10 bg-white p-5 shadow-sm">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#AE7C54]">
        {icon}
        {label}
      </div>

      <p
        className={`text-base font-semibold text-[#053c41] ${
          capitalize ? "capitalize" : ""
        }`}
      >
        {value || "Not available"}
      </p>
    </div>
  );
}