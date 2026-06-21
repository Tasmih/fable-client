"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { uploadImageToImgBB } from "@/lib/actions/uploadImage";
import {
  ArrowLeft,
  Person,
  Envelope,
  FileText,
  Pencil,
  ShieldCheck,
} from "@gravity-ui/icons";

export default function WriterUpdateProfileForm({
  formData,
  setFormData,
  onSubmit,
  submitting,
}) {
  const [imageUploading, setImageUploading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("please select an image file");
      return;
    }

    try {
      setImageUploading(true);

      const imageUrl = await uploadImageToImgBB(file);

      setFormData((prev) => ({
        ...prev,
        image: imageUrl,
      }));

      toast.success("profile image uploaded successfully");
    } catch (err) {
      toast.error(err.message || "failed to upload image");
    } finally {
      setImageUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f6f1ea]/50 px-4 py-6 md:px-8">
      <section className="mx-auto max-w-5xl">
        <div className="mb-5 flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#f6f1ea] px-4 py-2 text-sm font-semibold text-[#AE7C54]">
              <Pencil className="h-4 w-4" />
              Update Writer Profile
            </div>

            <h1 className="text-3xl font-bold text-[#053c41] md:text-4xl">
              Edit Your Profile
            </h1>

            <p className="mt-2 text-sm text-[#053c41]/70">
              Update your writer name, profile photo, and bio.
            </p>
          </div>

          <Link
            href="/dashboard/writer/profile"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#053c41]/20 bg-white px-5 py-3 text-sm font-semibold text-[#053c41] transition hover:bg-[#053c41] hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back Profile
          </Link>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-3xl bg-white p-6 shadow-sm md:p-8"
        >
          <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
            <div className="rounded-3xl bg-[#f6f1ea] p-5 text-center">
              {formData.image ? (
                <img
                  src={formData.image}
                  alt={formData.name || "Writer"}
                  referrerPolicy="no-referrer"
                  className="mx-auto h-40 w-40 rounded-full border-4 border-[#AE7C54]/30 object-cover"
                />
              ) : (
                <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full bg-[#AE7C54] text-5xl font-bold text-white">
                  {(formData.name || "W").charAt(0).toUpperCase()}
                </div>
              )}

              <label className="mt-5 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#AE7C54] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#c99367]">
                <FileText className="h-4 w-4" />
                {imageUploading ? "Uploading..." : "Upload Image"}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              <p className="mt-3 text-xs leading-5 text-[#053c41]/60">
                Upload a clear profile image for your writer account.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#053c41]">
                  <Person className="h-4 w-4 text-[#AE7C54]" />
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full rounded-xl border border-[#053c41]/15 bg-white px-4 py-3 text-sm text-[#053c41] outline-none transition focus:border-[#AE7C54]"
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#053c41]">
                  <Envelope className="h-4 w-4 text-[#AE7C54]" />
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full cursor-not-allowed rounded-xl border border-[#053c41]/15 bg-[#f6f1ea] px-4 py-3 text-sm text-[#053c41]/70 outline-none"
                />

                <p className="mt-1 text-xs text-[#053c41]/50">
                  Email cannot be changed.
                </p>
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#053c41]">
                  <ShieldCheck className="h-4 w-4 text-[#AE7C54]" />
                  Writer Bio
                </label>

                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Write a short writer bio"
                  className="w-full resize-none rounded-xl border border-[#053c41]/15 bg-white px-4 py-3 text-sm text-[#053c41] outline-none transition focus:border-[#AE7C54]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || imageUploading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#053c41] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0f6f7a] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ShieldCheck className="h-4 w-4" />
                {submitting ? "Updating..." : "Update Profile"}
              </button>
            </div>
          </div>
        </form>
      </section>
    </main>
  );
}