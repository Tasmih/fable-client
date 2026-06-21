"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useSession } from "@/lib/auth-client";
import { getUserProfile } from "@/lib/actions/users";
import {
  Person,
  Envelope,
  Pencil,
  ShieldCheck,
  BookOpen,
} from "@gravity-ui/icons";

export default function WriterProfilePage() {
  const { data: session, isPending } = useSession();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const userEmail = session?.user?.email || "";

  const loadProfile = async () => {
    if (!userEmail) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const data = await getUserProfile(userEmail);
      setProfile(data);
    } catch (err) {
      toast.error(err.message || "failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isPending) return;

    loadProfile();
  }, [isPending, userEmail]);

  if (isPending || loading) {
    return (
      <main className="min-h-screen bg-[#f6f1ea]/50 px-4 py-6 md:px-8">
        <section className="mx-auto max-w-5xl rounded-3xl bg-white p-10 text-center shadow-sm">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#AE7C54]/20 border-t-[#AE7C54]" />

          <p className="mt-3 text-sm font-semibold text-[#053c41]">
            Loading writer profile...
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f1ea]/50 px-4 py-6 md:px-8">
      <section className="mx-auto max-w-5xl">
        <div className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#f6f1ea] px-4 py-2 text-sm font-semibold text-[#AE7C54]">
                <Person className="h-4 w-4" />
                Writer Profile
              </div>

              <h1 className="text-3xl font-bold text-[#053c41] md:text-4xl">
                Profile Information
              </h1>

              <p className="mt-2 text-sm text-[#053c41]/70">
                View your writer account details and verification status.
              </p>

               
            </div>

           
            
             <Link
              href="/dashboard/writer/updateProfile"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#AE7C54] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c99367]"
            >
              <Pencil className="h-4 w-4" />
              Update Profile
            </Link>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
            <div className="rounded-3xl bg-[#f6f1ea] p-5 text-center">
              {profile?.image || session?.user?.image ? (
                <img
                  src={profile?.image || session?.user?.image}
                  alt={profile?.name || session?.user?.name || "Writer"}
                  referrerPolicy="no-referrer"
                  className="mx-auto h-36 w-36 rounded-full border-4 border-[#AE7C54]/30 object-cover"
                />
              ) : (
                <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full bg-[#AE7C54] text-5xl font-bold text-white">
                  {(profile?.name || session?.user?.name || "W")
                    ?.charAt(0)
                    ?.toUpperCase()}
                </div>
              )}

              <h2 className="mt-4 text-2xl font-bold text-[#053c41]">
                {profile?.name || session?.user?.name || "Writer"}
              </h2>

              <p className="mt-1 text-sm text-[#053c41]/70">
                {profile?.email || session?.user?.email}
              </p>
            </div>

            <div className="grid gap-4">
              <div className="rounded-2xl border border-[#053c41]/10 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f6f1ea] text-[#AE7C54]">
                    <Person className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase text-[#053c41]/50">
                      Name
                    </p>

                    <p className="text-lg font-bold text-[#053c41]">
                      {profile?.name || session?.user?.name || "Not set"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#053c41]/10 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f6f1ea] text-[#AE7C54]">
                    <Envelope className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase text-[#053c41]/50">
                      Email
                    </p>

                    <p className="text-lg font-bold text-[#053c41]">
                      {profile?.email || session?.user?.email || "Not set"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#053c41]/10 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f6f1ea] text-[#AE7C54]">
                    <BookOpen className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase text-[#053c41]/50">
                      Role
                    </p>

                    <p className="text-lg font-bold capitalize text-[#053c41]">
                      {profile?.role || "writer"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#053c41]/10 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f6f1ea] text-[#AE7C54]">
                    <ShieldCheck className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase text-[#053c41]/50">
                      Writer Verification
                    </p>

                    <p className="text-lg font-bold text-[#053c41]">
                      {profile?.writerVerified
                        ? "Verified Writer"
                        : "Not Verified"}
                    </p>
                  </div>
                </div>
              </div>

              {profile?.bio && (
                <div className="rounded-2xl border border-[#053c41]/10 bg-white p-5">
                  <p className="text-xs font-semibold uppercase text-[#053c41]/50">
                    Bio
                  </p>

                  <p className="mt-2 leading-7 text-[#053c41]/80">
                    {profile.bio}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}