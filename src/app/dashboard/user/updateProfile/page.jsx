"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useSession } from "@/lib/auth-client";
import {
  getUserProfile,
  updateUserProfile,
} from "@/lib/actions/users";
import {
  ArrowLeft,
  ImagePlus,
  Loader2,
  Mail,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";

export default function UpdateProfilePage() {
  const { data: session, isPending } = useSession();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [previewImage, setPreviewImage] = useState("");

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

        setProfile(finalProfile);
        setName(finalProfile?.name || session?.user?.name || "");
        setImage(finalProfile?.image || session?.user?.image || "");
        setPreviewImage(finalProfile?.image || session?.user?.image || "");
      } catch (err) {
        toast.error(err.message || "failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [isPending, userEmail, session?.user]);

  const uploadImageToImgBB = async (file) => {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    if (!apiKey) {
      throw new Error("imgBB api key is missing");
    }

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!data?.success) {
      throw new Error("failed to upload image");
    }

    return data.data.url;
  };

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("please select an image file");
      return;
    }

    try {
      setSaving(true);

      const localPreview = URL.createObjectURL(file);
      setPreviewImage(localPreview);

      const uploadedUrl = await uploadImageToImgBB(file);

      setImage(uploadedUrl);
      setPreviewImage(uploadedUrl);

      toast.success("image uploaded successfully");
    } catch (err) {
      toast.error(err.message || "failed to upload image");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateProfile = async (event) => {
    event.preventDefault();

    if (!name.trim()) {
      toast.error("name is required");
      return;
    }

    try {
      setSaving(true);

      const data = await updateUserProfile(userEmail, {
        name: name.trim(),
        image,
      });

      setProfile(data.user);
      toast.success("profile updated successfully");
    } catch (err) {
      toast.error(err.message || "failed to update profile");
    } finally {
      setSaving(false);
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
            You need to login to update your profile.
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
    <main className="min-h-screen bg-[#f6f1ea]/50 px-4 py-6 md:px-8">
      <section className="mx-auto max-w-5xl">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/dashboard/user/profile"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#053c41]/20 bg-white px-4 py-3 text-sm font-semibold text-[#053c41] shadow-sm transition hover:bg-[#053c41] hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to Profile
          </Link>
        </div>

        <div className="mb-5 rounded-3xl bg-white p-6 shadow-sm md:p-8">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#f6f1ea] px-4 py-2 text-sm font-semibold text-[#AE7C54]">
            <ShieldCheck size={16} />
            Update Profile
          </div>

          <h1 className="text-3xl font-bold text-[#053c41] md:text-4xl">
            Edit Your Profile
          </h1>

          <p className="mt-2 text-sm text-[#053c41]/70">
            Update your display name and profile picture.
          </p>
        </div>

        <form
          onSubmit={handleUpdateProfile}
          className="rounded-3xl bg-white p-6 shadow-sm md:p-8"
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
            <div className="rounded-2xl bg-[#f6f1ea] p-5 text-center">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt={name || "User"}
                  className="mx-auto h-36 w-36 rounded-3xl object-cover"
                />
              ) : (
                <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-3xl bg-[#053c41] text-white">
                  <UserRound size={46} />
                </div>
              )}

              <label className="mt-4 inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#AE7C54] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#c99367]">
                <ImagePlus size={16} />
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#053c41]">
                  Full Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-[#053c41]/15 bg-white px-4 py-3 text-sm text-[#053c41] outline-none transition focus:border-[#AE7C54]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#053c41]">
                  Email Address
                </label>

                <div className="flex items-center gap-2 rounded-xl border border-[#053c41]/15 bg-[#f6f1ea] px-4 py-3 text-sm text-[#053c41]/70">
                  <Mail size={16} className="text-[#AE7C54]" />
                  {userEmail}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#053c41]">
                  Role
                </label>

                <input
                  type="text"
                  value={profile?.role || session?.user?.role || "user"}
                  disabled
                  className="w-full cursor-not-allowed rounded-xl border border-[#053c41]/15 bg-[#f6f1ea] px-4 py-3 text-sm capitalize text-[#053c41]/70 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#053c41] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f6f7a] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </section>
    </main>
  );
}