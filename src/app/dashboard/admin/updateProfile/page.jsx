"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { getUserProfile, updateUserProfile } from "@/lib/actions/users";
import { Loader2, UserRound } from "lucide-react";
import AdminUpdateProfileForm from "@/components/dashboard/admin/AdminUpdateProfileForm";

export default function AdminUpdateProfilePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    image: "",
    role: "admin",
  });

  const userEmail = session?.user?.email || "";

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

        setFormData({
          name: finalProfile?.name || session?.user?.name || "",
          email: finalProfile?.email || session?.user?.email || "",
          image: finalProfile?.image || session?.user?.image || "",
          role: finalProfile?.role || session?.user?.role || "admin",
        });
      } catch (err) {
        toast.error(err.message || "Failed to load admin profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [
    isPending,
    userEmail,
    session?.user?.name,
    session?.user?.email,
    session?.user?.image,
    session?.user?.role,
  ]);

  const handleUpdateProfile = async (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      setSubmitting(true);

      const data = await updateUserProfile(userEmail, {
        name: formData.name.trim(),
        image: formData.image,
      });

      const updatedUser = data?.user || {};

      setFormData((prev) => ({
        ...prev,
        name: updatedUser.name || prev.name,
        image: updatedUser.image || prev.image,
        role: updatedUser.role || prev.role,
      }));

      toast.success("Admin profile updated successfully");

      router.refresh();

      setTimeout(() => {
        router.push("/dashboard/admin/profile");
      }, 800);
    } catch (err) {
      toast.error(err.message || "Failed to update admin profile");
    } finally {
      setSubmitting(false);
    }
  };

  if (isPending || loading) {
    return (
      <main className="min-h-screen bg-[#f6f1ea]/50 px-4 py-6 md:px-8">
        <section className="mx-auto max-w-5xl rounded-3xl bg-white p-10 text-center shadow-sm">
          <Loader2 size={34} className="mx-auto animate-spin text-[#AE7C54]" />

          <p className="mt-3 text-sm font-semibold text-[#053c41]">
            Loading update profile...
          </p>
        </section>
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="min-h-screen bg-[#f6f1ea]/50 px-4 py-8">
        <section className="mx-auto max-w-3xl rounded-3xl bg-white p-8 text-center shadow-sm">
          <UserRound size={48} className="mx-auto text-[#AE7C54]" />

          <h1 className="mt-4 text-2xl font-bold text-[#053c41]">
            Please login first
          </h1>

          <p className="mt-2 text-sm text-[#053c41]/70">
            You need to login to update your admin profile.
          </p>

          <Link
            href="/auth/signin"
            className="mt-5 inline-flex rounded-xl bg-[#053c41] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f6f7a]"
          >
            Login Now
          </Link>
        </section>
      </main>
    );
  }

  return (
    <AdminUpdateProfileForm
      formData={formData}
      setFormData={setFormData}
      onSubmit={handleUpdateProfile}
      submitting={submitting}
    />
  );
}