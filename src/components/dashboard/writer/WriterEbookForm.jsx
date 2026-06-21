"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { BookOpen, FileText, Plus, ShieldCheck } from "@gravity-ui/icons";
import { uploadImageToImgBB } from "@/lib/actions/uploadImage";

const genres = [
  "Fiction",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Fantasy",
  "Horror",
  "Adventure",
  "Education",
  "Biography",
  "Business",
];

export default function WriterEbookForm({
  mode = "add",
  initialData = null,
  onSubmit,
  submitting = false,
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fullContent: "",
    price: "",
    genre: "Fiction",
    coverImage: "",
    status: "published",
  });

  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        fullContent: initialData.fullContent || "",
        price: initialData.price || "",
        genre: initialData.genre || "Fiction",
        coverImage: initialData.coverImage || "",
        status: initialData.status || "published",
      });
    }
  }, [initialData]);

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
        coverImage: imageUrl,
      }));

      toast.success("cover image uploaded successfully");
    } catch (err) {
      toast.error(err.message || "failed to upload cover image");
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.fullContent.trim() ||
      !formData.price ||
      !formData.genre ||
      !formData.coverImage
    ) {
      toast.error("please fill all ebook fields");
      return;
    }

    onSubmit({
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      fullContent: formData.fullContent.trim(),
      price: Number(formData.price),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl bg-white p-5 shadow-sm md:p-8"
    >
      {/* form header */}
      <div className="mb-6">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#f6f1ea] px-4 py-2 text-sm font-semibold text-[#AE7C54]">
          <BookOpen className="h-4 w-4" />
          Ebook Details
        </div>

        <h2 className="text-2xl font-bold text-[#053c41]">
          {mode === "edit" ? "Edit Ebook" : "Add New Ebook"}
        </h2>

        <p className="mt-1 text-sm text-[#053c41]/70">
          Add ebook title, description, full content, price, genre, and cover
          image.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[300px_1fr]">
        {/* cover image */}
        <div className="rounded-3xl bg-[#f6f1ea] p-5">
          <p className="mb-3 text-sm font-bold text-[#053c41]">
            Cover Image
          </p>

          {formData.coverImage ? (
            <img
              src={formData.coverImage}
              alt="ebook cover"
              className="h-80 w-full rounded-2xl object-cover"
            />
          ) : (
            <div className="flex h-80 w-full items-center justify-center rounded-2xl border border-dashed border-[#053c41]/25 bg-white text-[#053c41]/60">
              <div className="text-center">
                <FileText className="mx-auto h-10 w-10 text-[#AE7C54]" />

                <p className="mt-2 text-sm font-semibold">
                  No cover uploaded
                </p>
              </div>
            </div>
          )}

          <label className="mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#AE7C54] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#c99367]">
            <Plus className="h-4 w-4" />
            {imageUploading ? "Uploading..." : "Upload Cover"}

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        {/* form fields */}
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#053c41]">
              Ebook Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter ebook title"
              className="w-full rounded-xl border border-[#053c41]/15 bg-white px-4 py-3 text-sm text-[#053c41] outline-none transition focus:border-[#AE7C54]"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#053c41]">
                Price
              </label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="10"
                className="w-full rounded-xl border border-[#053c41]/15 bg-white px-4 py-3 text-sm text-[#053c41] outline-none transition focus:border-[#AE7C54]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#053c41]">
                Genre
              </label>

              <select
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#053c41]/15 bg-white px-4 py-3 text-sm text-[#053c41] outline-none transition focus:border-[#AE7C54]"
              >
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#053c41]">
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#053c41]/15 bg-white px-4 py-3 text-sm text-[#053c41] outline-none transition focus:border-[#AE7C54]"
              >
                <option value="published">Published</option>
                <option value="unpublished">Unpublished</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#053c41]">
              Short Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Write ebook short description"
              className="w-full resize-none rounded-xl border border-[#053c41]/15 bg-white px-4 py-3 text-sm text-[#053c41] outline-none transition focus:border-[#AE7C54]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#053c41]">
              Full Content
            </label>

            <textarea
              name="fullContent"
              value={formData.fullContent}
              onChange={handleChange}
              rows={10}
              placeholder="Write full ebook content"
              className="w-full resize-none rounded-xl border border-[#053c41]/15 bg-white px-4 py-3 text-sm text-[#053c41] outline-none transition focus:border-[#AE7C54]"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || imageUploading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#053c41] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0f6f7a] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <ShieldCheck className="h-4 w-4" />

            {submitting
              ? "Saving..."
              : mode === "edit"
              ? "Update Ebook"
              : "Add Ebook"}
          </button>
        </div>
      </div>
    </form>
  );
}