"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useSession } from "@/lib/auth-client";
import { getUserProfile, updateUserProfile } from "@/lib/actions/users";
import WriterUpdateProfileForm from "@/components/dashboard/writer/WriterUpdateProfileForm";

export default function WriterUpdateProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    image: "",
    bio: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const userEmail = session?.user?.email || "";

  const loadProfile = async () => {
    if (!userEmail) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const data = await getUserProfile(userEmail);

      setFormData({
        name: data?.name || session?.user?.name || "",
        email: data?.email || session?.user?.email || "",
        image: data?.image || session?.user?.image || "",
        bio: data?.bio || "",
      });
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      toast.error("name is required");
      return;
    }

    try {
      setSubmitting(true);

      await updateUserProfile(userEmail, {
        name: formData.name.trim(),
        image: formData.image,
        bio: formData.bio.trim(),
      });

      toast.success("writer profile updated successfully");
      router.push("/dashboard/writer/profile");
    } catch (err) {
      toast.error(err.message || "failed to update profile");
    } finally {
      setSubmitting(false);
    }
  };

  if (isPending || loading) {
    return (
      <main className="min-h-screen bg-[#f6f1ea]/50 px-4 py-6 md:px-8">
        <section className="mx-auto max-w-5xl rounded-3xl bg-white p-10 text-center shadow-sm">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#AE7C54]/20 border-t-[#AE7C54]" />

          <p className="mt-3 text-sm font-semibold text-[#053c41]">
            Loading update profile...
          </p>
        </section>
      </main>
    );
  }

  return (
    <WriterUpdateProfileForm
      formData={formData}
      setFormData={setFormData}
      onSubmit={handleSubmit}
      submitting={submitting}
    />
  );
}