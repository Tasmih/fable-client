"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { uploadImageToImgBB } from "@/lib/actions/uploadImage";
import {
  ArrowLeft,
  ImagePlus,
  Loader2,
  Mail,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";

export default function UserUpdateProfileForm({
  formData,
  setFormData,
  onSubmit,
  submitting,
}) {
  const [imageUploading, setImageUploading] = useState(false);

  const handleNameChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      name: event.target.value,
    }));
  };

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const previousImage = formData.image;
    const localPreview = URL.createObjectURL(file);

    try {
      setImageUploading(true);

      setFormData((prev) => ({
        ...prev,
        image: localPreview,
      }));

      const uploadedUrl = await uploadImageToImgBB(file);

      setFormData((prev) => ({
        ...prev,
        image: uploadedUrl,
      }));

      toast.success("Image uploaded. Click Save Changes to update profile.");
    } catch (err) {
      setFormData((prev) => ({
        ...prev,
        image: previousImage,
      }));

      toast.error(err.message || "Failed to upload image");
    } finally {
      setImageUploading(false);
      event.target.value = "";
      URL.revokeObjectURL(localPreview);
    }
  };

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
          onSubmit={onSubmit}
          className="rounded-3xl bg-white p-6 shadow-sm md:p-8"
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
            <div className="rounded-2xl bg-[#f6f1ea] p-5 text-center">
              {formData.image ? (
                <img
                  src={formData.image}
                  alt={formData.name || "User"}
                  className="mx-auto h-36 w-36 rounded-3xl object-cover"
                />
              ) : (
                <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-3xl bg-[#053c41] text-white">
                  <UserRound size={46} />
                </div>
              )}

              <label className="mt-4 inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#AE7C54] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#c99367]">
                {imageUploading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <ImagePlus size={16} />
                )}

                {imageUploading ? "Uploading..." : "Upload Image"}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={imageUploading}
                  className="hidden"
                />
              </label>

              <p className="mt-3 text-xs leading-5 text-[#053c41]/60">
                Upload a clear profile image. Click Save Changes after upload.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#053c41]">
                  Full Name
                </label>

                <input
                  type="text"
                  value={formData.name}
                  onChange={handleNameChange}
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
                  {formData.email}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#053c41]">
                  Role
                </label>

                <input
                  type="text"
                  value={formData.role || "user"}
                  disabled
                  className="w-full cursor-not-allowed rounded-xl border border-[#053c41]/15 bg-[#f6f1ea] px-4 py-3 text-sm capitalize text-[#053c41]/70 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || imageUploading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#053c41] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f6f7a] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
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