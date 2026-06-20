"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useSession } from "@/lib/auth-client";
import { getPurchasedEbooks } from "@/lib/actions/users";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Loader2,
  ShoppingBag,
} from "lucide-react";

export default function UserBooksPage() {
  const { data: session, isPending } = useSession();

  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const userEmail = session?.user?.email || "";

  const formatDate = (date) => {
    if (!date) return "unknown";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  useEffect(() => {
    if (isPending) return;

    if (!userEmail) {
      setLoading(false);
      return;
    }

    const loadBooks = async () => {
      try {
        setLoading(true);
        const data = await getPurchasedEbooks(userEmail);
        setEbooks(Array.isArray(data) ? data : []);
      } catch (err) {
        toast.error(err.message || "failed to load purchased ebooks");
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, [isPending, userEmail]);

  if (loading || isPending) {
    return (
      <main className="min-h-screen bg-[#f6f1ea]/50 px-4 py-6 md:px-8">
        <section className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-3xl bg-white p-4 shadow-sm"
              >
                <div className="h-56 rounded-2xl bg-[#053c41]/10" />
                <div className="mt-4 h-5 w-3/4 rounded bg-[#053c41]/10" />
                <div className="mt-3 h-4 w-1/2 rounded bg-[#053c41]/10" />
                <div className="mt-5 h-10 rounded-xl bg-[#053c41]/10" />
              </div>
            ))}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f1ea]/50 px-4 py-6 md:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="mb-5 rounded-3xl bg-white p-5 shadow-sm md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#f6f1ea] px-4 py-2 text-sm font-semibold text-[#AE7C54]">
                <ShoppingBag size={16} />
                Purchased Collection
              </div>

              <h1 className="text-3xl font-bold text-[#053c41] md:text-4xl">
                My Books
              </h1>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-[#053c41]/70">
                All ebooks you have purchased and unlocked for reading.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:w-[350px]">
              <Link
                href="/dashboard/user"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#053c41]/20 bg-white px-4 py-3 text-sm font-semibold text-[#053c41] transition hover:bg-[#053c41] hover:text-white"
              >
                <ArrowLeft size={16} />
                Dashboard
              </Link>

              <Link
                href="/ebooks"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#AE7C54] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#c99367]"
              >
                <BookOpen size={16} />
                Browse More
              </Link>
            </div>
          </div>
        </div>

        {ebooks.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
            <BookOpen size={48} className="mx-auto text-[#AE7C54]" />

            <h2 className="mt-4 text-2xl font-bold text-[#053c41]">
              No purchased ebook yet
            </h2>

            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#053c41]/70">
              Buy an ebook to unlock its full content and see it here.
            </p>

            <Link
              href="/ebooks"
              className="mt-5 inline-flex rounded-xl bg-[#053c41] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f6f7a]"
            >
              Browse Ebooks
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {ebooks.map((ebook) => (
              <div
                key={ebook._id}
                className="rounded-3xl bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <Link href={`/ebooks/${ebook._id}`}>
                  <img
                    src={
                      ebook.coverImage ||
                      "https://placehold.co/400x560?text=Fable+Ebook"
                    }
                    alt={ebook.title}
                    className="h-64 w-full rounded-2xl bg-[#f6f1ea] object-contain"
                  />
                </Link>

                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="rounded-full bg-[#f6f1ea] px-3 py-1 text-xs font-semibold text-[#053c41]">
                      {ebook.genre || "Ebook"}
                    </span>

                    <span className="font-bold text-[#AE7C54]">
                      ${Number(ebook.price || 0).toFixed(2)}
                    </span>
                  </div>

                  <Link href={`/ebooks/${ebook._id}`}>
                    <h2 className="line-clamp-2 text-base font-bold text-[#053c41] transition hover:text-[#AE7C54]">
                      {ebook.title}
                    </h2>
                  </Link>

                  <p className="mt-1 line-clamp-1 text-xs text-[#053c41]/60">
                    by {ebook.writerName || "unknown writer"}
                  </p>

                  <div className="mt-2 flex items-center gap-1 text-xs text-[#053c41]/60">
                    <CalendarDays size={13} className="text-[#AE7C54]" />
                    {formatDate(ebook.purchaseDate || ebook.createdAt)}
                  </div>

                  <Link
                    href={`/ebooks/${ebook._id}`}
                    className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#053c41] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0f6f7a]"
                  >
                    <BookOpen size={15} />
                    Read Ebook
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}