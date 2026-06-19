'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import { toast } from 'react-toastify';
import { BookOpen, ImagePlus, X, Loader2, Upload, DollarSign, Tag } from 'lucide-react';
import { createEbook } from "@/lib/actions/ebooks";

const GENRES = [
  'Fiction', 'Mystery', 'Romance', 'Sci-Fi',
  'Fantasy', 'Horror', 'Biography', 'History',
  'Self-Help', 'Technology', 'Poetry', 'Thriller'
];

export default function AddEbookPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const [form, setForm] = useState({
    title: '',
    description: '',
    fullContent: '',
    price: '',
    genre: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Show spinner while session loads
  if (isPending) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin" size={36} style={{ color: '#AE7C54' }} />
      </div>
    );
  }

  // Redirect if not authenticated
  if (!session?.user) {
    router.push('/auth/signin');
    return null;
  }

  // Update form field on change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Set image file and generate local preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // Clear selected image and preview
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  // Upload cover image to imgBB and return hosted URL
  const uploadToImgBB = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_KEY}`,
      { method: 'POST', body: formData }
    );

    // HTML error checking
    const contentType = res.headers.get("content-type");
    if (!res.ok || !contentType || !contentType.includes("application/json")) {
      throw new Error('Image upload failed. Please check your ImgBB API Key.');
    }

    const data = await res.json();
    if (!data.success) throw new Error('Image upload failed');
    return data.data.url;
  };

  // Validate fields, upload image, then POST ebook to backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) return toast.error('Title is required');
    if (!form.description.trim()) return toast.error('Description is required');
    if (!form.fullContent.trim()) return toast.error('Full content is required');
    if (!form.price || Number(form.price) <= 0) return toast.error('Enter a valid price');
    if (!form.genre) return toast.error('Please select a genre');
    if (!imageFile) return toast.error('Cover image is required');

    setLoading(true);
    try {
     
      toast.info('Uploading cover image...', {
        style: { backgroundColor: '#053c41', color: '#ffffff' },
        progressStyle: { backgroundColor: '#AE7C54' }
      });
      
      const coverImage = await uploadToImgBB(imageFile);

      await createEbook({
         ...form,
         price: Number(form.price),
         coverImage,
         writerName: session.user.name,
         writerEmail: session.user.email,
         writerId: session.user.id,
         status: "published",
      });

      toast.success('Ebook published successfully!');
      router.push('/dashboard/writer');
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Shared input class using theme colors
  const inputClass = `
    w-full rounded-xl px-4 py-3 text-sm
    bg-white border border-[#053c41]/20
    text-[#053c41] placeholder-[#053c41]/40
    focus:outline-none focus:ring-2 focus:ring-[#AE7C54]/50 focus:border-[#AE7C54]
    transition
  `;

  return (
    <div className="min-h-screen bg-[#f6f1ea]/30 py-10 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#053c41' }}>
              <BookOpen className="text-white" size={20} />
            </div>
            <h1 className="text-2xl font-bold" style={{ color: '#053c41' }}>
              Add New Ebook
            </h1>
          </div>
          <p className="text-sm pl-1" style={{ color: '#053c41', opacity: 0.6 }}>
            Publishing as{' '}
            <span className="font-semibold" style={{ color: '#AE7C54' }}>
              {session.user.name}
            </span>
          </p>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#053c41]/10 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Book title */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#053c41' }}>
                Book Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter your ebook title"
                className={inputClass}
              />
            </div>

            {/* Genre and price row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Genre */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#053c41' }}>
                  <span className="flex items-center gap-1.5">
                    <Tag size={14} />
                    Genre <span className="text-red-400">*</span>
                  </span>
                </label>
                <select
                  name="genre"
                  value={form.genre}
                  onChange={handleChange}
                  className={inputClass}
                  style={{ cursor: 'pointer' }}
                >
                  <option value="">Select a genre</option>
                  {GENRES.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#053c41' }}>
                  <span className="flex items-center gap-1.5">
                    <DollarSign size={14} />
                    Price (USD) <span className="text-red-400">*</span>
                  </span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="e.g. 9.99"
                  min="0.01"
                  step="0.01"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Description - public preview */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#053c41' }}>
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Short preview visible to all users before purchase..."
                rows={4}
                className={`${inputClass} resize-none`}
              />
              <p className="text-xs mt-1" style={{ color: '#053c41', opacity: 0.5 }}>
                Visible to everyone as a teaser before purchase
              </p>
            </div>

            {/* Full content - visible only after purchase */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#053c41' }}>
                Full Content <span className="text-red-400">*</span>
              </label>
              <textarea
                name="fullContent"
                value={form.fullContent}
                onChange={handleChange}
                placeholder="Write the complete ebook content here..."
                rows={10}
                className={`${inputClass} resize-none`}
              />
              <p className="text-xs mt-1" style={{ color: '#AE7C54' }}>
                Only visible to readers after they complete purchase
              </p>
            </div>

            {/* Cover image upload */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#053c41' }}>
                Cover Image <span className="text-red-400">*</span>
              </label>

              {/* Clickable upload zone */}
              <label className="cursor-pointer block">
                <div
                  className={`
                    border-2 border-dashed rounded-xl transition-all
                    flex items-center justify-center min-h-[200px]
                    ${imagePreview
                      ? 'border-[#AE7C54] bg-[#AE7C54]/5'
                      : 'border-[#053c41]/20 hover:border-[#AE7C54] hover:bg-[#AE7C54]/5'
                    }
                  `}
                >
                  {imagePreview ? (
                    // Preview selected image
                    <div className="flex justify-center py-4">
                      <img
                        src={imagePreview}
                        alt="Cover preview"
                        className="h-48 w-36 object-cover rounded-lg shadow-md"
                      />
                    </div>
                  ) : (
                    // Upload placeholder
                    <div className="text-center py-12" style={{ color: '#053c41', opacity: 0.4 }}>
                      <ImagePlus className="mx-auto mb-3" size={36} />
                      <p className="font-medium text-sm">Click to upload cover image</p>
                      <p className="text-xs mt-1">JPG, PNG, WEBP supported</p>
                    </div>
                  )}
                </div>

                {/* Hidden file input */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {/* Remove image button */}
              {imagePreview && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="mt-2 flex items-center gap-1 text-xs text-red-400 hover:text-red-500 transition"
                >
                  <X size={13} />
                  Remove image
                </button>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-[#053c41]/10" />

            {/* Action buttons */}
            <div className="flex gap-3">

              {/* Cancel button */}
              <button
                type="button"
                onClick={() => router.back()}
                disabled={loading}
                className="flex-1 py-3 rounded-xl text-sm font-semibold border transition disabled:opacity-50"
                style={{
                  borderColor: '#053c41',
                  color: '#053c41',
                  backgroundColor: 'transparent',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(5, 60, 65, 0.1)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Cancel
              </button>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ backgroundColor: loading ? '#AE7C54' : '#053c41' }}
                onMouseEnter={e => !loading && (e.currentTarget.style.backgroundColor = '#AE7C54')}
                onMouseLeave={e => !loading && (e.currentTarget.style.backgroundColor = '#053c41')}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Upload size={16} />
                    Publish Ebook
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}