"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getEbooks } from "@/lib/actions/ebooks";

export default function FeaturedEbooks() {
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const params = new URLSearchParams();
        params.append("page", 1);
        params.append("limit", 6);
        params.append("sort", "newest");
        const data = await getEbooks(params.toString());
        setEbooks(data.ebooks || []);
      } catch {
        setEbooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <section className="bg-[#f6f1ea] px-4 py-16 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 text-sm font-semibold uppercase tracking-[0.25em] text-[#AE7C54]">
              freshly added
            </p>
            <h2 className="text-3xl font-bold text-[#053c41] md:text-4xl">
              Featured Ebooks
            </h2>
          </div>
          <Link
            href="/browse"
            className="shrink-0 rounded-xl border border-[#053c41]/20 px-5 py-2.5 text-sm font-semibold text-[#053c41] transition hover:bg-[#053c41] hover:text-white"
          >
            Browse All
          </Link>
        </div>

        {loading && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl border border-[#053c41]/10 bg-[#ede7dc] p-3"
              >
                <div className="h-48 rounded-xl bg-[#053c41]/10 md:h-60" />
                <div className="mt-4 h-4 w-3/4 rounded bg-[#053c41]/10" />
                <div className="mt-2 h-3 w-1/2 rounded bg-[#053c41]/10" />
                <div className="mt-4 h-8 rounded bg-[#053c41]/10" />
              </div>
            ))}
          </div>
        )}

        {!loading && ebooks.length === 0 && (
          <div className="rounded-2xl border border-[#053c41]/10 bg-[#ede7dc] p-10 text-center">
            <p className="text-[#053c41]/60">No ebooks available yet.</p>
          </div>
        )}

        {!loading && ebooks.length > 0 && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {ebooks.map((ebook) => (
              <Link
                href={`/ebooks/${ebook._id}`}
                key={ebook._id}
                className="group overflow-hidden rounded-2xl border border-[#053c41]/10 bg-[#ede7dc] shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative bg-[#f6f1ea]">
                  <img
                    src={ebook.coverImage || "https://placehold.co/400x560?text=Fable+Ebook"}
                    alt={ebook.title}
                    className="h-48 w-full object-cover md:h-60"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-[#053c41] px-3 py-1 text-xs font-semibold text-white shadow">
                    {ebook.genre}
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="line-clamp-2 text-sm font-bold text-[#053c41] md:text-base">
                    {ebook.title}
                  </h3>
                  <p className="mt-1 line-clamp-1 text-xs font-medium text-[#0f6f7a] md:text-sm">
                    by {ebook.writerName || "unknown writer"}
                  </p>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-[#AE7C54] md:text-base">
                      ${ebook.price}
                    </span>
                    <span className="rounded-xl bg-[#053c41] px-3 py-1 text-xs font-semibold text-white transition group-hover:bg-[#AE7C54]">
                      View Details
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}