"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  CalendarDays,
  DollarSign,
  Loader2,
  Lock,
  ShoppingCart,
  Tag,
  UserRound,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import {
  getEbookById,
  createCheckoutSession,
  addBookmark,
  removeBookmark,
} from "@/lib/actions/ebooks";

export default function EbookDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [ebook, setEbook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [error, setError] = useState("");

  const userEmail = session?.user?.email || "";

  // load single ebook
  const fetchEbook = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getEbookById(id, userEmail);
      setEbook(data);
    } catch (err) {
      setError(err.message || "failed to load ebook");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    if (isPending) return;

    fetchEbook();
  }, [id, userEmail, isPending]);

  // buy ebook using stripe checkout
  const handlePurchase = async () => {
    if (!session?.user) {
      toast.info("Please login to purchase this ebook");
      router.push(`/auth/signin?redirect=/ebooks/${id}`);
      return;
    }

    if (ebook?.isWriter) {
      toast.error("You cannot purchase your own ebook");
      return;
    }

    if (ebook?.hasPurchased) {
      toast.info("You already purchased this ebook");
      return;
    }

    try {
      setPurchaseLoading(true);

      const data = await createCheckoutSession({
        ebookId: id,
        userEmail: session.user.email,
      });

      window.location.href = data.url;
    } catch (err) {
      toast.error(err.message || "failed to start payment");
    } finally {
      setPurchaseLoading(false);
    }
  };

  // add or remove bookmark
  const handleBookmark = async () => {
    if (!session?.user) {
      toast.info("Please login to bookmark this ebook");
      router.push(`/auth/signin?redirect=/ebooks/${id}`);
      return;
    }

    try {
      setBookmarkLoading(true);

      if (ebook.hasBookmarked) {
        await removeBookmark(id, session.user.email);

        setEbook((prev) => ({
          ...prev,
          hasBookmarked: false,
        }));

        toast.success("Bookmark removed");
      } else {
        await addBookmark(id, session.user.email);

        setEbook((prev) => ({
          ...prev,
          hasBookmarked: true,
        }));

        toast.success("Ebook bookmarked");
      }
    } catch (err) {
      toast.error(err.message || "failed to update bookmark");
    } finally {
      setBookmarkLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "unknown";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading || isPending) {
    return (
      <main className="min-h-screen bg-[#f6f1ea]/50 px-4 py-8 md:px-8">
        <section className="mx-auto max-w-7xl">
          <div className="animate-pulse rounded-3xl bg-white p-6 shadow-sm md:p-8">
            <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
              <div className="h-[560px] rounded-2xl bg-[#053c41]/10" />

              <div>
                <div className="h-8 w-3/4 rounded bg-[#053c41]/10" />
                <div className="mt-4 h-4 w-1/2 rounded bg-[#053c41]/10" />
                <div className="mt-8 h-24 rounded bg-[#053c41]/10" />
                <div className="mt-8 h-12 w-44 rounded bg-[#053c41]/10" />
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#f6f1ea]/50 px-4 py-8 md:px-8">
        <section className="mx-auto max-w-3xl rounded-3xl border border-red-100 bg-white p-10 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-[#053c41]">
            Ebook not found
          </h1>

          <p className="mt-2 text-sm text-red-500">{error}</p>

          <Link
            href="/ebooks"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#053c41] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f6f7a]"
          >
            <ArrowLeft size={16} />
            Back to ebooks
          </Link>
        </section>
      </main>
    );
  }

  if (!ebook) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#f6f1ea]/50 px-4 py-8 md:px-8">
      <section className="mx-auto max-w-7xl">
        <Link
          href="/ebooks"
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#053c41]/20 bg-white px-5 py-2.5 text-sm font-semibold text-[#053c41] shadow-sm transition hover:border-[#AE7C54]/50 hover:bg-[#053c41] hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Browse Ebooks
        </Link>

        <div className="rounded-3xl border border-[#053c41]/10 bg-white p-5 shadow-sm md:p-8">
          <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
            {/* cover image */}
            <div className="rounded-2xl border border-[#053c41]/10 bg-[#f6f1ea] p-4">
              <img
                src={
                  ebook.coverImage ||
                  "https://placehold.co/400x560?text=Fable+Ebook"
                }
                alt={ebook.title}
                className="h-[520px] w-full rounded-xl object-contain md:h-[620px]"
              />
            </div>

            {/* ebook info */}
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold text-white ${
                    ebook.hasPurchased ? "bg-[#AE7C54]" : "bg-[#053c41]"
                  }`}
                >
                  {ebook.hasPurchased ? "Sold" : "Available"}
                </span>

                {ebook.isWriter && (
                  <span className="rounded-full bg-[#f6f1ea] px-4 py-1.5 text-xs font-semibold text-[#053c41]">
                    Your Ebook
                  </span>
                )}

                <span className="rounded-full bg-[#f6f1ea] px-4 py-1.5 text-xs font-semibold text-[#053c41]">
                  {ebook.genre}
                </span>
              </div>

              <h1 className="text-3xl font-bold leading-tight text-[#053c41] md:text-5xl">
                {ebook.title}
              </h1>

              <div className="mt-5 grid gap-3 text-sm text-[#053c41]/80 md:grid-cols-2">
                <div className="flex items-center gap-2">
                  <UserRound size={17} className="text-[#AE7C54]" />
                  <span>
                    Writer:{" "}
                    <Link
                      href={`/ebooks?search=${encodeURIComponent(
                        ebook.writerName || ""
                      )}`}
                      className="font-semibold text-[#053c41] hover:text-[#AE7C54]"
                    >
                      {ebook.writerName || "unknown writer"}
                    </Link>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <DollarSign size={17} className="text-[#AE7C54]" />
                  <span>
                    Price:{" "}
                    <span className="font-bold text-[#AE7C54]">
                      ${ebook.price}
                    </span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Tag size={17} className="text-[#AE7C54]" />
                  <span>Genre: {ebook.genre}</span>
                </div>

                <div className="flex items-center gap-2">
                  <CalendarDays size={17} className="text-[#AE7C54]" />
                  <span>Uploaded: {formatDate(ebook.createdAt)}</span>
                </div>
              </div>

              <div className="mt-7 rounded-2xl bg-[#f6f1ea]/70 p-5">
                <h2 className="text-lg font-bold text-[#053c41]">
                  Description
                </h2>

                <p className="mt-2 leading-7 text-[#053c41]/80">
                  {ebook.description}
                </p>
              </div>

              {/* action buttons */}
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <button
                  onClick={handlePurchase}
                  disabled={
                    purchaseLoading || ebook.hasPurchased || ebook.isWriter
                  }
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#053c41] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0f6f7a] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {purchaseLoading ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Redirecting...
                    </>
                  ) : ebook.hasPurchased ? (
                    "Purchased"
                  ) : ebook.isWriter ? (
                    "Own Ebook"
                  ) : (
                    <>
                      <ShoppingCart size={15} />
                      Buy Now
                    </>
                  )}
                </button>

                <button
                  onClick={handleBookmark}
                  disabled={bookmarkLoading}
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#AE7C54]/40 bg-[#f6f1ea] px-4 py-2.5 text-sm font-semibold text-[#053c41] transition hover:bg-[#AE7C54] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {bookmarkLoading ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Updating...
                    </>
                  ) : ebook.hasBookmarked ? (
                    <>
                      <BookmarkCheck size={15} />
                      Bookmarked
                    </>
                  ) : (
                    <>
                      <Bookmark size={15} />
                      Bookmark
                    </>
                  )}
                </button>

                <Link
                  href="/ebooks"
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#053c41]/20 bg-white px-4 py-2.5 text-sm font-semibold text-[#053c41] transition hover:bg-[#053c41] hover:text-white"
                >
                  <ArrowLeft size={15} />
                  Back
                </Link>
              </div>

              {/* ebook content */}
              <div className="mt-6 rounded-2xl border border-[#053c41]/10 bg-white p-5 shadow-sm">
                <h2 className="text-xl font-bold text-[#053c41]">
                  Ebook Content
                </h2>

                {ebook.canReadFullContent ? (
                  <div className="mt-4 max-h-[420px] overflow-y-auto whitespace-pre-line rounded-2xl bg-[#f6f1ea]/70 p-5 leading-8 text-[#053c41]/85">
                    {ebook.fullContent}
                  </div>
                ) : (
                  <div className="mt-4 rounded-2xl border border-[#AE7C54]/20 bg-[#f6f1ea] p-6 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#053c41] text-white">
                      <Lock size={20} />
                    </div>

                    <h3 className="mt-4 text-lg font-bold text-[#053c41]">
                      Full content is locked
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-[#053c41]/70">
                      Purchase this ebook to unlock and read the complete
                      content.
                    </p>

                    <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
                      <button
                        onClick={handlePurchase}
                        disabled={purchaseLoading || ebook.isWriter}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#AE7C54] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#814718] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {purchaseLoading ? (
                          <>
                            <Loader2 size={15} className="animate-spin" />
                            Redirecting...
                          </>
                        ) : (
                          <>
                            <ShoppingCart size={15} />
                            Buy Now
                          </>
                        )}
                      </button>

                      <Link
                        href="/ebooks"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#053c41]/20 bg-white px-5 py-2.5 text-sm font-semibold text-[#053c41] transition hover:bg-[#053c41] hover:text-white"
                      >
                        <ArrowLeft size={15} />
                        Back to Browse Ebooks
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}